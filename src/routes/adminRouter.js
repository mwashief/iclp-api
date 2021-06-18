const appRoot = require("app-root-path");
const express = require("express");
const { isAdmin } = require("../middlewares/auth");
const { body } = require("express-validator");
const SQL = require("sql-template-strings");
const { validate, dbQuery, jsonDBQuery } = require("../util");
const fs = require("fs");
const multer = require("multer");

const adminRouter = express.Router({ mergeParams: true });
adminRouter.use(express.json());

const problemUpload = multer({
    storage: multer.diskStorage({
        async destination(req, file, cb) {
            const body = req.body;
            console.log(body);
            const result = await dbQuery(
                SQL`
                INSERT INTO public.challenges (id, title, content, category, difficulty, score)
                VALUES (DEFAULT, ${body.title}, ${body.statement}, 'code', ${body.difficulty}, ${body.score})
                returning id;
                `
            );
            if (result instanceof Error) {
            } else {
                const dir = `${appRoot}/uploads/${result[0].id}`;
                body.problemid = result[0].id;
                console.log(dir);
                fs.mkdirSync(dir, { recursive: true });
                cb(null, dir);
                const testDir = `${dir}/tests`;
                fs.mkdirSync(testDir);
                body.tests.split(",").forEach((test, index) => {
                    fs.writeFile(`${testDir}/${index}`, test, function (err) {
                        if (err) throw err;
                        console.log(`Saved test ${index}`);
                    });
                });
            }
        },
        filename(req, file, cb) {
            cb(null, file.fieldname);
        },
    }),
});

adminRouter.route("/create-problem").post(
    // NOTE: rom now on, only admins can create problems
    isAdmin,
    // NOTE: multer.single('f') discards all fields after f
    problemUpload.single("checker"),
    (req, res, next) => {
        const body = req.body;
        console.log(body.problemid);
        console.log(req.file.filename);
        jsonDBQuery(
            res,
            next,
            SQL`
            INSERT INTO challenge_topics (challenge_id, topic_id)
            VALUES (${body.problemid}, ${body.topicid})
            returning challenge_id id;
            `
        );
    }
);

adminRouter.route("/add-quiz").post(
    // NOTE: from now on, only admins can add quizes
    isAdmin,
    async (req, res, next) => {
        const body = req.body;
        const result = await dbQuery(
            SQL`
                INSERT INTO challenges (id, title, content, category, difficulty, score, time)
                VALUES (DEFAULT, ${body.title}, ${body.content}, 'mcq', ${body.difficulty}, ${body.score}, ${body.time})
                returning id;
                `
        );
        if (result instanceof Error) {
            next(result);
        } else {
            await jsonDBQuery(
                res,
                next,
                SQL`
            INSERT INTO challenge_topics (challenge_id, topic_id)
            VALUES (${result[0].id}, ${body.topic})
            `
            );
        }
    }
);

module.exports = adminRouter;
