function loadData() {

    var $body = $('#img-cont');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');
    var $street = $('#street').val();
    var $city = $('#city').val();
    var url = 'https://api.nytimes.com/svc/search/v2/articlesearch.json';
    var wikiUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + $city + '&format=json&callback=?';

    var wikiRequestTimeout = setTimeout(function() {
        $wikiElem.text('Failed to get wikipedia resources');
    }, 8000);

    $wikiElem.text("");
    $nytElem.text("");

    // load streetview
    $greeting.text('So you want to live in ' + $street + ', ' + $city);
    var $streetview = 'https://maps.googleapis.com/maps/api/streetview?size=600x400&location=' + $street + ',' + $city&key=AIzaSyBlVnAXqLYftv-wDYkBXsNkuyEjwIcwKoo;
    if($("#img-cont:has(img.bgimg)").length > 0){
        $('img').remove();
        $body.append('<img class="bgimg" src="' + $streetview + '">');
    }else{
        $body.append('<img class="bgimg" src="' + $streetview + '">');
    }


    url += '?' + $.param({
        'q': $city,
        'sort': 'newest',
        'api-key': '9e5504c57460492ba989587a35841e3a'
    });

    $.ajax({
        url: url,
        method: 'GET',
    }).done(function(data) {
        //console.log(data.response.docs);
        $nytHeaderElem.text('New York Times Articles - ' + $city);
        $articles = data.response.docs;
        for (var i = 0; i < $articles.length; i++) {
            var $article = $articles[i];
            $nytElem.append('<li class="article">' + '<a href="' + $article.web_url + '">' + $article.headline.main
            + '</a>' + '<p>' + $article.snippet + '</p>' + '</li>');
        };
    }).fail(function() {
        $nytHeaderElem.text('New York Times Articles Could Not Be Loaded');
    });

    $.ajax({
        url: wikiUrl,
        method: 'GET',
        dataType: 'jsonp',
    }).done(function(data) {
        //console.log(data);
        $wikiLinks = data;
        for(var i = 0; i < $wikiLinks.length; i++) {
            $wikiElem.append('<li class="article">' + '<a href="' + 'https://en.wikipedia.org/wiki/' + $wikiLinks[i] + '">' + data[1][i] +'</a>' + '</li>');
        };
        clearTimeout(wikiRequestTimeout);
    })
    return false;
};

$('#form-container').submit(loadData);
