const user = require('./user');
const post = require('./post');

user.hasMany(post, {
    onDelete : 'CASCADE',
    onUpdate : 'CASCADE',
    foreignKey: "uploader",
    sourceKey: 'email'
});

post.belongsTo(user, {
    onDelete : 'NO ACTION',
    onUpdate : 'NO ACTION',
    foreignKey: "uploader",
    sourceKey: 'email'
});
module.exports = {
    post,
    user,
}