(function($){

    $(function(){
        $('.d3button').on('click', generate);
        
        _onStateChange();
        
        History.Adapter.bind(window, 'statechange', _onStateChange);
    });
    
    function _onStateChange() {
        
        var state = History.getState(),
            wordId = window.location.href.split('?')[1];
            
        window.yaCounter18037942 && window.yaCounter18037942.hit(window.location.href);
            
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
                zeroPad(Math.floor(Math.random() * words.postfix.length), 3),
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
        
        $('.b-share__button_type_twitter').html('<a href="https://twitter.com/share" class="twitter-share-button" data-text="' + item + ' #diablo3' + '" data-lang="ru" data-hashtags="d3name.ru" data-count="none">Твитнуть</a>');
        window.twttr && window.twttr.widgets.load();
        
        $('.b-share__button_type_vk').html(VK.Share.button({
            url: window.location.href,
            title: item,
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
    
    function change(wordId) {
        History.pushState({}, '', '?' + wordId);
    }
    
    function getRandomGender() {
        var totalBaseWordsCount = words.base.male.length + words.base.female.length + words.base.neuter.length + words.base.many.length,
        randomBaseWordId = Math.floor(Math.random() * totalBaseWordsCount),
        gender = randomBaseWordId <= words.base.male.length
            ? 'male'
            : randomBaseWordId <= words.base.male.length + words.base.female.length
                ? 'female'
                : randomBaseWordId <= words.base.male.length + words.base.female.length + words.base.neuter.length
                    ? 'neuter'
                    : 'many';
                    
        return gender;
    }
    
})(jQuery);