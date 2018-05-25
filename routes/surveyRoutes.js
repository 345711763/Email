const requireLogin = require("../middlewares/requiredLogin");
const requireCredits = require("../middlewares/requireCredits");
const mongoose = require("mongoose");
const Survey = mongoose.model('surveys');
const Mailer = require("../services/Mailer");
const surveyTemplate = require('../services/emailTemplates/surveyTemplate');
const _ = require("lodash");
const Path = require('path-parser').default;
const {URL} = require('url');

module.exports = app =>{
    app.get('/api/surveys', requireLogin, async (req, res) => {
        const surveys = await Survey.find({ _user: req.user.id }).select({
            recipients: false
        });

        res.send(surveys);
    });
    app.get('/api/surveys/:surveyId/:choice',(req,res)=>{
        res.send('Thanks for voting!');
    });
    app.post('/api/surveys/webhooks', (req, res) => {
        console.log(req.body);
        const p = new Path('/api/surveys/:surveyId/:choice');

        const events =
            _.chain(req.body)
                .filter(({event}) => event === 'click')
                .map(({email, url}) => {
                    // Try to extract data from url
                    const match = p.test(new URL(url).pathname);
                    return match ? {email, ...match} : undefined;
                })
                .compact()                     // remove undefined values from the array
                .uniqBy('email', 'surveyId')
                .each(({ surveyId, email, choice }) => {
                    Survey.updateOne(
                        {
                            _id: surveyId,
                            recipients: {
                                $elemMatch: { email: email, responded: false }
                            }
                        },
                        {
                            $inc: { [choice]: 1 },
                            $set: { 'recipients.$.responded': true },
                            lastResponded: new Date()
                        }
                    ).then(result => console.log(result));
                })
                .value();
        res.send({});
    });

    app.post('/api/surveys', requireLogin, requireCredits, async (req, res) => {
        const { title, subject, body, recipients } = req.body;

        const survey = new Survey({
            title,
            subject,
            body,
            recipients: recipients.split(',').map(email => ({ email: email.trim() })),
            _user: req.user.id,
            dateSent: Date.now()
        });

        // Great place to send an email!
        const mailer = new Mailer(survey, surveyTemplate(survey));

        try {
            await mailer.send();
            await survey.save();
            req.user.credit -= 1;
            const user = await req.user.save();

            res.send(user);
        } catch (err) {
            res.status(422).send(err);
        }
    });


};