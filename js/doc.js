'use strict'

$(() => {
    var converter = new showdown.Converter();

    let text = '# hello, markdown!';

    let html = converter.makeHtml(text);

    $('.main').append($(html));

    $.ajax({
        url: '../md/doc.md',
        dataType: 'text',
        success: function (data) {
            alert(data)
        }
    });
});