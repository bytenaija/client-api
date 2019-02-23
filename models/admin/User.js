const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const Schema = mongoose.Schema;

const AdminSchema = new Schema({
  email :{type: String,
          required: true,
          unique: true
        },
  firstname :{type: String,
          required: true
        },
  lastname :{type: String,
          required: true
        },
  password :{type: String,
          required: true
        },


}, {
  timestamps: true
})

AdminSchema.pre('save', function(next) {
    var admin = this;

    // only hash the password if it has been modified (or is new)
    if (!admin.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(10, function(err, salt) {
        if (err) return next(err);

        // hash the password along with our new salt
        bcrypt.hash(admin.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            admin.password = hash;
            next();
        });
    });
});

AdminSchema.methods.saveToken = (token) =>{
  let admin = this;
  admin.token = token;
}


AdminSchema.methods.comparePassword = (userPassword, password, cb) => {
  let user = this;

  bcrypt.compare(password, userPassword, (err, isMatch) => {
     console.log("ismat", isMatch)
    if (err) {
      cb(err)
    } else {
      cb(null, isMatch)
    }

  })
}
module.exports = mongoose.model('administrators', AdminSchema)
