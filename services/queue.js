const moment = require('moment')
const EmailService = require('./EmailService')

module.exports = {
    createFeedJobs: (queue, io, socketId, time) =>{
        var now = moment(new Date());
        let weekly = moment(now).add(7, 'D');
        let monthly = moment(now).add(1, 'M');
        let threeMonths = moment(now).add(3, 'M');
        let sixMonths = moment(now).add(6, 'M');

        let duration = moment.duration(weekly.diff(now));
        weekly = duration.asMilliseconds();

       duration = moment.duration(monthly.diff(now));
        monthly = duration.asMilliseconds();

        duration = moment.duration(threeMonths.diff(now));
        threeMonths = duration.asMilliseconds();

        duration = moment.duration(sixMonths.diff(now));
        sixMonths = duration.asMilliseconds();


        //create weekly feeds;
        var feedsWeekly = queue.create('feeds-weekly' + weekly, {
            io,
            socketId,
          }).delay(weekly)
          .priority('high')
          .save();

          queue.process('feeds-weekly' + weekly, function(job, done){
            sendWeeklyUpdate(job.data.io, job.data.socketId, done);
          });


        //create monthly feeds;
          
        var feedsMonthly = queue.create('feeds-monthly' + monthly, {
            io,
            socketId,
          }).delay(monthly)
          .priority('high')
          .save();

          queue.process('feeds-monthly' + monthly, function(job, done){
            sendMonthlyUpdate(job.data.io, job.data.socketId, done);
          });


          var feedsThreeMonths = queue.create('feeds-threeMonths' + threeMonths, {
            io,
            socketId,
          }).delay(threeMonths)
          .priority('high')
          .save();

          queue.process('feeds-threeMonths' + threeMonths, function(job, done){
            sendThreeMonthsUpdate(job.data.io, job.data.socketId, done);
          });



          var feedsSixMonths = queue.create('feeds-sixMonths' + sixMonths, {
            io,
            socketId,
          }).delay(sixMonths)
          .priority('high')
          .save();

          queue.process('feeds-sixMonths' + sixMonths, function(job, done){
            sendSixMonthsUpdate(job.data.io, job.data.socketId, done);
          });
    },

    createEmailJob: (queue, emailAddress, password, name, template) =>{
        var now = moment(new Date());
        
        let few = moment().add(30, 'seconds');
        duration = moment.duration(few.diff(now));
        few = duration.asMilliseconds();

        console.log("Fewwwwwwwwwwwwwwwwwwwwwwwww", few);

        var feedsSixMonths = queue.create('feeds-sixMonths' + few, {
            emailAddress,
            password,
            name,
            template
          }).delay(Math.abs(few))
          .priority('high')
          .save();

          queue.process('feeds-sixMonths' + few, function(job, done){
            sendEmail(job.data.emailAddress, job.data.password, job.data.name, job.data.template, done);
          });
    }


}

function sendWeeklyUpdate(io, socketId, done){
    io.sockets.socket(socketId).emit('feeds', {message: 'Your goat has been vacinated this week'});
    done();
}


function sendMonthlyUpdate(io, socketId, done){
    io.sockets.socket(socketId).emit('feeds', {message: 'Your goat has been vacinated this week'});
    done();
}

function sendThreeMonthsUpdate(io, socketId, done){
    io.sockets.socket(socketId).emit('feeds', {message: 'Your goat has been vacinated this week'});
    done();
}

function sendSixMonthsUpdate(io, socketId, done){
    io.sockets.socket(socketId).emit('feeds', {message: 'Your goat has been vacinated this week'});
    done();
}

function sendEmail(emailAddress, password, name, template){
    EmailService.email(emailAddress, password, name, template);
}