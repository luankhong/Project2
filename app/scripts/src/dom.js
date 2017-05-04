import $ from 'jquery';
export class PollForm {
    constructor(formSel, postedFormSel) {
        this.$form = $(formSel);
        this.$postedForm = $(postedFormSel);
    }

    init(submitCallback) {
        this.$form.submit((event) => {
            event.preventDefault();
            console.log('Clicked Submit');
            let question = $('#question').val();
            let choice1 = $('#choice1').val();
            let choice2 = $('#choice2').val();

            let data = {header:'poll', question:question, choice1:choice1, choice2:choice2};
            submitCallback(data);
            //this.$input.val('');
        });

        this.$postedForm.submit((event) => {
            event.preventDefault();
            console.log('Clicked Submit Answer Choice');
            let answer;
            if($('#choice1Radio').is(':checked')) {
                console.log('a selected');
                answer = 'a';
            }else if($('#choice2Radio').is(':checked')) {
                console.log('b selected');
                answer = 'b';
            }
            let data = {header:'answer', answer:answer};
            console.log(data);
            submitCallback(data);
        });

        this.$form.find('button').on('click', () => this.$form.submit());

        this.$postedForm.find('button').on('click', () => this.$postedForm.submit());
    }
}


export class AnswerList {
    constructor(listSel) {
        this.$list = $(listSel);
    }

    listingAnswer({
        question: q,
        choice1: c1,
        choice2: c2
    }) {
        $('label[for="questionLabel"]').text(q);
        $('label[for="choice1Radio"]').text(c1);
        $('label[for="choice2Radio"]').text(c2);
    }
}
