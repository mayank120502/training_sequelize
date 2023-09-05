const user = require('./user');
const post = require('./post');
const following = require('./follower');

user.hasMany(post, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
  foreignKey: 'uploader',
  sourceKey: 'email'
});

post.belongsTo(user, {
  onDelete: 'NO ACTION',
  onUpdate: 'NO ACTION',
  foreignKey: 'uploader',
  targetKey: 'email'
});

user.hasMany(following, {
  as: 'followers',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
  sourceKey: 'id',
  foreignKey: 'followedBy'
});

following.belongsTo(user, {
  as: 'followers',
  onDelete: 'NO ACTION',
  onUpdate: 'NO ACTION',
  targetKey: 'id',
  foreignKey: 'followedBy'
});

user.hasMany(following, {
  as: 'followingTo',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
  sourceKey: 'id',
  foreignKey: 'followedTo'
});

following.belongsTo(user, {
  as: 'followingTo',
  onDelete: 'NO ACTION',
  onUpdate: 'NO ACTION',
  targetKey: 'id',
  foreignKey: 'followedTo'
});

module.exports = {
  post,
  user,
  following
};
