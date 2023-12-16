const {db} = require("../db");

exports.getSession = async (req, res, next) => {
    try {
        const sessDoc = db.doc(`sessions/${req.params.sessId}`);
        const sessSnapshot = await sessDoc.get();

        if (!sessSnapshot.exists) {
            return res.status(404).send('Session not found');
        }

        const map = sessSnapshot.data();

        res.status(200).json(map);
    } catch (error) {
        console.error('Erreur lors de la récupération de la session :', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.createSessions = async (req, res, next) => {
    try {
        const sessions = req.body.sessions;

        if (!sessions || !Array.isArray(sessions) || sessions.length === 0) {
            return res.status(400).send('Sessions array is required in the request body');
        }

        const createdSessions = [];

        for (const session of sessions) {
            const sessionId = session.sessId;
            const sessDoc = db.doc(`sessions/${sessionId}`);
            await sessDoc.set({
                url: session.url,
            });

            createdSessions.push({sessionId, url: session.url});
        }

        res.status(200).json(createdSessions);
    } catch (error) {
        console.error('Erreur lors de la création des sessions :', error);
        res.status(500).send('Internal Server Error');
    }
}


