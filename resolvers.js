const user = {
  _id: '1',
  name: 'Mars',
  email: 'mars@gmail.com',
  picture: 'https://cloudinary.com/asdf',
}

module.exports = {
  Query: {
    me: () => user,
  },
}
