const db = require('../db/db.js');

function getRandomString(length) {
    return new Promise(resolve => {
        var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var result = '';
        for (var i = 0; i < length; i++) {
            result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
        }
        resolve(result)

    });

}

function CountDocuments() {
    return new Promise(resolve => {
        db.SubjectSchema.countDocuments({}, (err, cnt) => {
            if (err) throw err;
            resolve(cnt);
        });
    })
}

function AddSubjectToTeacher(subj) {
    return new Promise(resolve => {
        db.TeacherSchema.findOneAndUpdate(
            { username: subj.teachersUsername },
            { $push: { subjectsIDArray: { "subjectId": subj._id } } },
            function (error, success) {
                if (error) {
                    console.log(error);
                    resolve(error);
                } else {
                    //console.log(success);
                    resolve(success);
                }
            });

    });
}

function AddStudentsToSubject(id, username) {
    return new Promise(resolve => {
        db.SubjectSchema.findOneAndUpdate(
            { _id: id },
            { $push: { enrolledStudents: { "username": username } } },
            function (error, success) {
                if (error) {
                    console.log(error);
                    resolve(error);
                } else {
                    //console.log(success);
                    resolve(success);
                }
            });

    });
}

function AddStudentsToStudents(id, username) {
    return new Promise(resolve => {
        db.StudentSchema.findOneAndUpdate(
            { username: username },
            { $push: { subjectsIDArray:  { "subjectId": id } } },
            function (error, success) {
                if (error) {
                    console.log(error);
                    resolve(error);
                } else {
                    //console.log(success);
                    resolve(success);
                }
            });

    });
}



function GetInfo(id) {
    return new Promise(resolve => {
        db.SubjectSchema.findOne({ _id: id }, (err, result) => {
            if (err) throw err;
            resolve(result);
        });
    });
}

function updateSchema(id, mutableObject) {
    console.log(id, mutableObject);
    return new Promise(resolve => {
        db.SubjectSchema.updateOne({ _id: id }, {
            $set: { name: mutalbleObject.name, teachersName: mutableObject.teachersName, description: mutalbleObject.description }
        }, (err, result) => {
            if (err) throw err;
            console.log(result);
            resolve(result);
        });
    });
}
//{ "$in" : ["sushi"]}

function CheckUserExistance(username, id) {
    //console.log(username, id);
    return new Promise(resolve => {
        db.StudentSchema.find({ username: username, subjectsIDArray: { "$in": [{"subjectId":id}] } }, (err, result) => {
            if (err) throw err;
            console.log(result);
            console.log(result.length);
            if (result.length === 0) {
                resolve(true);
            }
            resolve(false);
        })
    });
}
                                                        

async function CreateSubject(req, res) {
    console.log("Hello");
    console.log(req.body);

    var unique_string = await getRandomString(5);
    var count = await CountDocuments();

    console.log(count);
    unique_string += count;

    const subj = new db.SubjectSchema({
        _id: unique_string,
        name: req.body.name,
        teachersName: req.body.teachersName,
        teachersUsername: req.body.teachersUsername,
        description: req.body.description,
        contentSchemaArray: [],
        lectureSchemaArray: [],
        assignmentsSchemaArray: [],
        enrolledStudents: [],
        videoLectureLink: ""
    });

    await AddSubjectToTeacher(subj);
    //const teacherObj=await AddSubjectToTeacher(subj.teachersUsername);


    subj.save((err) => {
        if (err) throw err;
        console.log("Subject information Saved to database successfully");

    });
    res.json({ "_id": subj._id });

}


async function GetSubjectInfo(req, res) {
    const subjectDetails = await GetInfo(req.query._id);
    res.json({
        _id: subjectDetails._id, // A 6 digit unique hash generated by backend 
        name: subjectDetails.name,
        teachersName: subjectDetails.teachersName,
        teachersUsername: subjectDetails.teachersUsername,
        description: subjectDetails.description,
        contentSchemaArray: subjectDetails.contentSchemaArray,
        videoLectureLink: subjectDetails.videoLectureLink,
        assignmentsSchemaArray: subjectDetails.assignmentsSchemaArray
    });
}

async function UpdateSubject(req, res) {
    const id = req.query._id;
    const subject = await GetInfo(id);
    mutalbleObject =
    {
        name: String,
        teachersName: String,
        description: String,
    }
    console.log(req.query.description);
    if (req.query.name != undefined) {
        mutalbleObject.name = req.query.name;
        console.log("Hl");
    }
    else {
        mutalbleObject.name = subject.name;
    }
    if (req.query.teachersName != undefined) {
        mutalbleObject.teachesName = req.query.teachersName;
    }
    else {
        mutalbleObject.teachersName = subject.teachersName;
    }
    if (req.query.description != undefined) {
        mutalbleObject.description = req.query.description;
    }
    else {
        mutalbleObject.description = subject.description;
    }
    await updateSchema(id, mutalbleObject);
    res.send(true);

}

async function JoinClass(req, res) {
    const id = req.body._id;
    const username = req.body.username;

    // First check if a student is enrolled or not
    const a = await CheckUserExistance(username, id);
    if (a) {
        console.log("In if");
        const k = await AddStudentsToSubject(id, username);
        console.log("k is ", k);
        if (k == null) {
            res.json("-2");
        }
        else {
            await AddStudentsToStudents(id, username);
            res.json({
                "_id": id
            });
        }
    }
    else {
        res.json("-1");
    }


}

module.exports = { CreateSubject, GetSubjectInfo, UpdateSubject, JoinClass };