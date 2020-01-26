const express = require('express');
const router = express.Router();
const requestHandler = require('../Handlers/requestHandler');
const userHandler = require('../Handlers/userHandler');
const postHandler = require('../Handlers/postHandler');

router.get('/showAll', async (req, res) => {
    const results = await requestHandler.findRequestsBy({ status: 'Pending' });
    if (results === -1) res.json({ message: 'Error Fetching Requests' });
    else res.json(results);
});


router.get('/:requesterId/show', async (req, res) => {
    const result = await requestHandler.findRequestsBy({ requester: req.params.requesterId });
    if (result === -1) res.json({ message: 'Error Fetching Requests' });
    else res.json(result[0]);
});


router.post('/addRequest', async (req, res, next) => {
    req.body.user_type = 'Requester';
    const location = req.body.location;
    req.body.password = req.body.phone_number;
    req.body.location = req.body.location.city;
    const requester = await userHandler.signup(req, res);
    if (requester.message) {
        res.json(requester);
    } else {
        req.body.requesterId = requester._id;
        req.body.location = location;
        const request = await requestHandler.addRequest(req, res);
        if (request) {
            try {
                await requestHandler.sendSubmitEmail(requester);
            } catch (err) {
                res.json({ message: err });
            }
        }
        res.send('Added Request');
    }
});


router.put('/:requestId/edit', async (req, res) => {
    await requestHandler.editRequest(req, res);
});


router.delete('/rejectRequest', async (req, res, next) => {
    const result = await requestHandler.findRequester(req.body.requestId, res);
    if (result) {
        req.body.requesterId = result.requester;
        next();
    }
}, (req, res, next) => {
    requestHandler.sendRejectEmail(req.body.requesterId, res);
    next();
}, async (req, res, next) => {
    await requestHandler.deleteRequester(req.body.requesterId, res);
    next();
}, async (req, res, next) => {
    await requestHandler.deleteRequest(req.body.requestId, res);
    res.send('rejected request');
});


router.delete('/deleteRequest', async (req, res, next) => {
    const post = await postHandler.findPostByRequest(req.body.requestId);
    if (post) {
        await postHandler.deletePost(post._id);
    }
    const request = await requestHandler.findRequestsBy({ request: req.body.requestId });
    await requestHandler.deleteRequester(request[0].requester, res);
    await requestHandler.deleteRequest(req.body.requestId, res);
    res.send('Deleted Request');
});
module.exports = {
    router
};