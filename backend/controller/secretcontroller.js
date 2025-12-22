import Secret from '../models/Secret.js';

// @desc    Get all secrets for authenticated user
// @route   GET /api/secrets
// @access  Private
export const getSecrets = async (req, res) => {
  try {
    const { type, search } = req.query;
    
    // Build query
    const query = { 
      userId: req.user.id,
      isActive: true
    };

    if (type) {
      query.type = type;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { 'metadata.category': { $regex: search, $options: 'i' } },
        { 'metadata.tags': { $regex: search, $options: 'i' } }
      ];
    }

    const secrets = await Secret.find(query)
      .select('-encryptedData.ciphertext') // Don't send full ciphertext in list view
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      results: secrets.length,
      data: { secrets }
    });
  } catch (error) {
    console.error('Get secrets error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch secrets',
      error: error.message
    });
  }
};

// @desc    Get single secret by ID
// @route   GET /api/secrets/:id
// @access  Private
export const getSecret = async (req, res) => {
  try {
    const secret = await Secret.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!secret) {
      return res.status(404).json({
        status: 'error',
        message: 'Secret not found'
      });
    }

    // Track access
    await secret.trackAccess();

    res.status(200).json({
      status: 'success',
      data: { secret }
    });
  } catch (error) {
    console.error('Get secret error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch secret',
      error: error.message
    });
  }
};

// @desc    Create new secret
// @route   POST /api/secrets
// @access  Private
export const createSecret = async (req, res) => {
  try {
    const { name, type, encryptedData, metadata, expiresAt } = req.body;

    // Validate encrypted data structure
    if (!encryptedData?.ciphertext || !encryptedData?.iv || 
        !encryptedData?.salt || !encryptedData?.authTag) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid encrypted data format'
      });
    }

    const secret = await Secret.create({
      userId: req.user.id,
      name,
      type,
      encryptedData,
      metadata,
      expiresAt
    });

    res.status(201).json({
      status: 'success',
      message: 'Secret created successfully',
      data: { secret }
    });
  } catch (error) {
    console.error('Create secret error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create secret',
      error: error.message
    });
  }
};

// @desc    Update secret
// @route   PUT /api/secrets/:id
// @access  Private
export const updateSecret = async (req, res) => {
  try {
    const { name, type, encryptedData, metadata, expiresAt } = req.body;

    const secret = await Secret.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!secret) {
      return res.status(404).json({
        status: 'error',
        message: 'Secret not found'
      });
    }

    // Update fields
    if (name) secret.name = name;
    if (type) secret.type = type;
    if (encryptedData) secret.encryptedData = encryptedData;
    if (metadata) secret.metadata = metadata;
    if (expiresAt !== undefined) secret.expiresAt = expiresAt;

    await secret.save();

    res.status(200).json({
      status: 'success',
      message: 'Secret updated successfully',
      data: { secret }
    });
  } catch (error) {
    console.error('Update secret error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update secret',
      error: error.message
    });
  }
};

// @desc    Delete secret (soft delete)
// @route   DELETE /api/secrets/:id
// @access  Private
export const deleteSecret = async (req, res) => {
  try {
    const secret = await Secret.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!secret) {
      return res.status(404).json({
        status: 'error',
        message: 'Secret not found'
      });
    }

    // Soft delete
    secret.isActive = false;
    await secret.save();

    res.status(200).json({
      status: 'success',
      message: 'Secret deleted successfully'
    });
  } catch (error) {
    console.error('Delete secret error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete secret',
      error: error.message
    });
  }
};

// @desc    Get secret statistics
// @route   GET /api/secrets/stats
// @access  Private
export const getSecretStats = async (req, res) => {
  try {
    const stats = await Secret.aggregate([
      { $match: { userId: req.user._id, isActive: true } },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalSecrets = await Secret.countDocuments({
      userId: req.user.id,
      isActive: true
    });

    res.status(200).json({
      status: 'success',
      data: {
        totalSecrets,
        byType: stats
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch statistics',
      error: error.message
    });
  }
};
