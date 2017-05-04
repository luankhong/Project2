import socket from './ws-client';
import {
    PollForm,
    AnswerList
} from './dom';
import $ from 'jquery';

const FORM_SELECTOR = '[data-poll="poll-form"]';
const POSTED_FORM_SELECTOR = '[data-poll="posted-poll-form"]';
const LIST_SELECTOR = '[data-poll="poll-list"]';

let countOfA = 0;
let countOfB = 0;

class PollApp {
    constructor() {
        this.pollForm = new PollForm(FORM_SELECTOR, POSTED_FORM_SELECTOR);
        this.answerList = new AnswerList(LIST_SELECTOR);
        socket.init('ws://localhost:3001');

        //When user first connect
        socket.registerOpenHandler(() => {
            this.pollForm.init((data) => {
                if (data.header === 'poll') {
                    //Sending out the poll
                    let poll = new Poll({
                        header: data.header,
                        question: data.question,
                        choice1: data.choice1,
                        choice2: data.choice2,
                        time: '60'
                    });

                    let everySec = setInterval((function() {
                        socket.sendMessage(poll.serialize());
                        poll.time = parseInt(poll.time) - 1;

                        if(poll.time < 0) {
                            clearInterval(everySec);
                        }
                    }), 1000);
                }
                //Sending out the answer
                else if (data.header === 'answer') {
                    let answerChoice = new Answer({
                        header: data.header,
                        answer: data.answer
                    });
                    socket.sendMessage(answerChoice.serialize());
                }
            });
        });

        //Receiving a message
        socket.registerMessageHandler((data) => {
            let poll;
            let answer;
            
            if (data.header === 'poll') {
                poll = new Poll(data);
                this.answerList.listingAnswer(poll.serialize());
                $('label[for="countDown"]').text(data.time);
            } else if (data.header === 'answer') {
                answer = new Answer(data);
                if(answer.answer === 'a') {
                    countOfA++;
                    $('label[for="countChoiceA"]').text(countOfA);
                } else if(answer.answer === 'b') {
                    countOfB++;
                    $('label[for="countChoiceB"]').text(countOfB);
                }
                console.log(answer.serialize());
            }
        });
    }
}

class Answer {
    constructor({
        header: h,
        answer: choice
    }) {
        this.header = h;
        this.answer = choice;
    }
    serialize() {
        return {
            header: this.header,
            answer: this.answer
        };
    }
}

class TimeLeft {
    constructor({
        header: h,
        time: sec
    }) {
        this.header = h;
        this.time = sec;
    }
    serialize() {
        return {
            header: this.header,
            time: this.time
        };
    }
}

class Poll {
    constructor({
        header: h,
        question: q,
        choice1: c1,
        choice2: c2,
        time: t
    }) {
        this.header = h;
        this.question = q;
        this.choice1 = c1;
        this.choice2 = c2;
        this.time = t;
    }
    serialize() {
        return {
            header: this.header,
            question: this.question,
            choice1: this.choice1,
            choice2: this.choice2,
            time: this.time
        };
    }
}

export default PollApp;
