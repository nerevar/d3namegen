(function($){

    $(function(){

        onStateChange();

        History.Adapter.bind(window, 'statechange', onStateChange);

        $('.d3button').on('click', generate);
        
    });

    function onStateChange() {
        
        var wordId = window.location.href.split('?')[1];
            
        if (wordId) {
            (isNaN(wordId) || wordId.length !== 10)
                ? generate(true)
                : load(wordId);
        }

    }
        
    function load(wordId) {
    
        var genderId = +wordId[0] - 1,
            gender = genders[genderId],
            wordIds = [
                wordId.slice(1, 4),
                wordId.slice(4, 7),
                wordId.slice(7, 10)
            ],
            item = [
                words.prefix[gender][+wordIds[0]],
                words.base[gender][+wordIds[1]],
                words.postfix[+wordIds[2]]
            ].join(' ');

        display(item);
        
    }

    function generate(forceShow) {
    
        var gender = getRandomGender(),
            genderId = genders.indexOf(gender),
            wordIds = [
                zeroPad(Math.floor(Math.random() * words.prefix[gender].length), 3),
                zeroPad(Math.floor(Math.random() * words.base[gender].length), 3),
                zeroPad(Math.floor(Math.random() * words.postfix.length), 3)
            ],
            wordId = [genderId+1].concat(wordIds).join(''),
            item;
            
        if (forceShow) {
            item = [
                words.prefix[gender][+wordIds[0]],
                words.base[gender][+wordIds[1]],
                words.postfix[+wordIds[2]]
            ].join(' ');
            
            display(item);
        }
            
        change(wordId);

        return false;
        
    }
    
    function display(item) {

        item = item.charAt(0).toUpperCase() + item.slice(1);
    
        $('.b-item').text(item);

        updateTwitter(item);

        updateVkontakte(item);

    }

    function change(wordId) {
        History.pushState({}, '', '?' + wordId);
    }

    function updateTwitter(text) {

        $('.b-share__button_type_twitter').html(
            $('<a></a>')
                .text('Твитнуть')
                .attr({
                    href: 'https://twitter.com/share',
                    'class': 'twitter-share-button',
                    'data-text': text + ' #diablo3',
                    'data-lang': 'ru',
                    'data-hashtags': 'd3name.ru',
                    'data-count': 'none'
                })
        );

        window.twttr && window.twttr.widgets.load();

    }

    function updateVkontakte(text) {

        $('.b-share__button_type_vk').html(VK.Share.button({
            url: window.location.href,
            title: text,
            description: ' — Генератор названий предметов Diablo 3 — http://d3name.ru',
            image: 'http://d3name.ru/img/d3small.jpg',
            noparse: true
        }, {
            type: "round_nocount",
            text: "Поделиться"
        }));

    }

    function zeroPad(number, length) {       

        var str = '' + number;

        while (str.length < length) {
            str = '0' + str;
        }

        return str;

    }

    // cache arrays length into closure variables
    var maleWordsLength = words.base.male.length,
        femaleWordsLength = words.base.female.length,
        neuterWordsLength = words.base.neuter.length,
        manyWordsLength = words.base.many.length,
        totalBaseWordsCount = maleWordsLength + femaleWordsLength + neuterWordsLength + manyWordsLength;

    function getRandomGender() {

        var randomBaseWordId = Math.floor(Math.random() * totalBaseWordsCount),
            gender = randomBaseWordId <= maleWordsLength
                ? 'male'
                : randomBaseWordId <= maleWordsLength + femaleWordsLength
                    ? 'female'
                    : randomBaseWordId <= maleWordsLength + femaleWordsLength + neuterWordsLength
                        ? 'neuter'
                        : 'many';
                    
        return gender;

    }
    
})(jQuery);