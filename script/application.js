// Github1 - mattkenefick/js
var github1 = new GitHub('mattkenefick', 'js');
var tree1 = new GitHubTree($('#github'), github1, 'com');
    tree1.bindCodeUpdate($('#code'), Prism.highlightAll);

// Github2 - mattkenefick/Rosemary
var github2 = new GitHub('mattkenefick', 'Rosemary');
var tree2 = new GitHubTree($('#github-2'), github2);
    tree2.bindCodeUpdate($('#code-2'), Prism.highlightAll);