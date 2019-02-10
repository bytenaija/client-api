const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const _ = require('lodash')

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },

  phoneNumber: {
    type: String,
    required: false,
    
  },

  state: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  
  carts: [{ type: Schema.Types.ObjectId, ref: 'Cart' }],
  farms: [{ type: Schema.Types.ObjectId, ref: 'Farm' }],
  addresses: [{ type: Schema.Types.ObjectId, ref: 'Address' }],
  gifts: [{ type: Schema.Types.ObjectId, ref: 'Gifting' }],
  profile: { type: Schema.Types.ObjectId, ref: 'Profile' },

}, {
  timestamps: true
})

UserSchema.pre('save', function (next) {
  var user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  // generate a salt
  bcrypt.genSalt(10, function (err, salt) {
    if (err) return next(err);

    // hash the password along with our new salt
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);

      // override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
});

UserSchema.pre('findOneAndUpdate', function(next) {
 // console.log("this .update", this.getUpdate())
  const update = this.getUpdate();
  if (!_.isEmpty(update.password)) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(update.password, salt, (err, hash) => {
        this.getUpdate().password = hash;
       // console.log(this.getUpdate())
        next();
      })
    })
  } else {
    next();
  }
});

UserSchema.methods.comparePassword = (userPassword, password, cb) => {
  let user = this;
  console.dir(password)
  // console.log(this.password)
  bcrypt.compare(password, userPassword, (err, isMatch) => {
  //  console.log("ismat", isMatch)
    if (err) {
      cb(err)
    } else {
      cb(null, isMatch)
    }

  })
}
UserSchema.methods.saveToken = (token) => {
  let user = this;
  user.token = token;
}

UserSchema.methods.getUserByToken = (token) => {
  let user = this;

  if (user.token == token) {
    return user
  } else {
    throw new Error("This user does not have a token");
  }

}

module.exports = mongoose.model('User', UserSchema)