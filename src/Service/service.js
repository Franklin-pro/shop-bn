import User from '../model/user';

/**
 * Fetches a user by their email address.
 * @param {string} email - The email address of the user.
 * @returns {Promise<Object|null>} - Returns the user object or null if not found.
 */
export async function getUserByEmail(email) {
  return await User.findOne({ email });
}

/**
 * Saves the reset token and its expiry time for a user.
 * @param {string} userId - The ID of the user.
 * @param {string} resetToken - The reset token to be saved.
 * @returns {Promise<void>}
 */
export async function saveResetToken(userId, resetToken) {
  const hashedToken = require('crypto').createHash('sha256').update(resetToken).digest('hex');
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  user.passwordResetToken = hashedToken;
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  await user.save({ validateBeforeSave: false });
}
