var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var path = require('path');
var exphbs = require('express-handlebars');
var nodemailer = require('nodemailer');

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
	res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.post('/send', function(req, res){
		var output = `
		<p> You have a new contact request</p>
		<h3>Contact Details</h3>
		<ul>
			<li>Name: ${req.body.name}</li>
			<li>Email: ${req.body.email}</li>
			<li>Phone: ${req.body.phone}</li>
		</ul>
		<h3>Message</h3>
		<p>${req.body.message}</p>
	`;
	let transporter = nodemailer.createTransport({
        host: 'smtpout.asia.secureserver.net',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: "sales@aakarindustries.com", // generated ethereal user
            pass: "aakar@9586200004" // generated ethereal password
        },
        tls: {
        	rejectUnauthorized: false
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Aakar Industries" <sales@aakarindustries.com>', // sender address
        to: 'sales@aakarindustries.com', // list of receivers
        subject: 'New contact request', // Subject line
        text: 'Hello world?', // plain text body
        html: output // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    });
    res.sendFile(path.join(__dirname + '/public/contact.html'));
});

app.listen(process.env.PORT || 3000, function(){
	console.log('Server is listening on port 3000');
});