// Github1 - mattkenefick/js
var github1 = new GitHub('mattkenefick', 'js');
var tree1 = new GitHubTree($('#github'), github1, 'com');

$(tree1).bind('file', function onFileClick($e, $content) {
    $('#code').html($content.split('<').join('&lt;'));
    Prism.highlightAll();
});


// Github2 - mattkenefick/Rosemary
var github2 = new GitHub('mattkenefick', 'Rosemary');
var tree2 = new GitHubTree($('#github-2'), github2);

$(tree2).bind('file', function onFileClick($e, $content, $file) {
    var ext = $file.split('/').pop().split('.').pop();

    switch (ext) {
        case 'png':
        case 'jpg':
        case 'jpeg':
        case 'gif':
            $('#code-2').html("<img src='" + github2.getRawUrl({branch: 'master/', dir: $file}) + "' />");
            break;

        default:
            $('#code-2').html($content.split('<').join('&lt;'));
            Prism.highlightAll();
    };

});