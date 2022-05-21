const nodemailer = require('nodemailer');
var amqp = require('amqplib/callback_api');


let mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'rentit.all.oficial@gmail.com',
        pass: 'rentit2022'
    }
});
  


amqp.connect('amqp://rabbitmq', function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }

        var queue = 'queue';

        channel.assertQueue(queue, {
            durable: true
        });

        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

        channel.consume(queue, function(msg) {
            console.log(" [x] Received %s", msg.content.toString());

            let mailDetails = {
                from: 'house_share@gmail.com',
                to: msg.content.toString(),
                subject: 'Request Accepted',
                text: 'Your request was accepted! Bravo!'
            };

            mailTransporter.sendMail(mailDetails, function(err, data) {
                if(err) {
                    console.log('Error Occurs' + err.message);
                    return channel.nack(msg);
                } else {
                    console.log('Email sent successfully');
                    channel.ack(msg);
                }
            });
        });

    });
});
