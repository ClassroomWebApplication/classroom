
// Add Profile Image column Later

const { Schema } = require("mongoose");
const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique:true,
        index:true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique:true,
    },
    role: {
        type: Boolean,  // 0== Teacher, 1== Student
        required: true
    }

});

const LectureSchema = new Schema({
    day: {
        type: String,
        required: true

    },
    startTime: {
        type: String,
        required: true
    }
    ,
    endTime: {
        type: String,
        required: true
    }
});

const ContentSchema = new Schema({
    body: String,
    date: {
        type: Date,
        required: true
    },
    files: String,   // Url of the file
    username: {   //either student or teacher
        type: String,
        required: true
    },  //may be a teacher or a student
});

const AssignmentsSchema = new Schema({
    _id: String,
    title: {
        type: String,
        required: true
    },
    points: Number,
    body: String,
    date: {
        type: Date,
        required: true
    },
    files: String, // Url of the file
    deadline: Date,
    flag: {
        type: Boolean,
        require: true
    }
    // True== Test, false== Assignment
});

const SubjectSchema = new Schema({
    _id: String, // A 6 digit unique hash generated by backend 
    name: {
        type:String,
        required:true
    } ,
    teachersName: String,
    teachersUsername: {
        type:String,
        required:true
    },
    description: String,
    contentSchemaArray: [ContentSchema],
    videoLectureLink: String,
    lectureSchemaArray: [LectureSchema],
    assignmentsSchemaArray: [AssignmentsSchema]
});

const MarkAssignmentsSchema = new Schema({
    marks: Number,
    assignmentId: String,  // _id of Assignments Schema
    files: String,
    subjectId: String,   // _id from SubjectSchema
    flag: Number   //1== Not submitted, 2== Done late, 3==Submitted on/before time
});

const StudentSchema = new Schema({
    username: {
        type:String,
        required:true
    }
        ,  // Username from UserSchema
    marksAssignmentSchemaArray: [MarkAssignmentsSchema],
    subjectsIDArray: [String]  // Array that will be array of subject id's(_id)
});

const TeacherSchema = new Schema({  
    username: {
        type:String,
        required:true
    },   // Username from UserSchema
    subjectsIDArray: [{subjectId:String}]    // Array that will be array of subject id's(_id)
});

module.exports = {
    UserSchema,
    LectureSchema,
    ContentSchema,
    AssignmentsSchema,
    SubjectSchema,
    MarkAssignmentsSchema,
    StudentSchema,
    TeacherSchema
}