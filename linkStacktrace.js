function linkStacktrace(oauthToken, stackTrace, userOrRepo) {
    var ret = "";
    var notFound = {};
    var ambiguous = {};
    var nameMismatch = {};
    var cache = {}; // used to cache found files. key: before (see below), value: match.html_url (see further below) or notFound or ambiguous or nameMismatch
    stackTrace.split('\n').forEach(function(line) {
        var parsedLine = /(.*)\((.*):(\d*)\)/.exec(line);
        if(parsedLine != null && typeof(parsedLine[1] == "string") && typeof(parsedLine[2] == "string") && typeof(parsedLine[3] == "string")) {
            var before = parsedLine[1];
            var filename = parsedLine[2];
            var linenum = parsedLine[3];
            var compilationUnit = /[a-z]\w*(?:\.[a-z]\w*)*\.[a-zA-Z]\w*/.exec(before)[0];
            if(compilationUnit in cache) {
                if(typeof(cache[compilationUnit]) === "string") {
                    ret += before + "([" + filename + ":" + linenum + "](" + cache[compilationUnit] + "#L" + linenum + "))\n";
                } else {
                    ret += line + '\n';
                }
                return;
            }
            var req = new XMLHttpRequest();
            var userRepo;
            if(userOrRepo.indexOf('/') != -1) // userOrRepo.contains('/')
                userRepo = "repo:" + userOrRepo;
            else
                userRepo = "user:" + userOrRepo;
            req.open("GET", "https://api.github.com/search/code?" + 
                "access_token=" + oauthToken + "&" +
                "q=" + filename + "+in:path+" + userRepo + "&" +
                "per_page=2", false);
            req.setRequestHeader("Accept", "application/vnd.github.beta+json");
            req.onload = function(e) {
                if (req.readyState === 4) {
                    if (req.status === 200) {
                        var response = JSON.parse(req.responseText);
                        if(response.total_count === 0) {
                            console.log("file " + filename + " not found");
                            ret += line + '\n';
                            cache[compilationUnit] = notFound;
                            return;
                        } else if(response.total_count > 1) {
                            console.log("file " + filename + " ambiguous");
                            ret += line + '\n';
                            cache[compilationUnit] = ambiguous;
                            return;
                        }
                        // exactly one match
                        var match = response.items[0];
                        if(match.name != filename) {
                            console.log("file name " + match.name + " doesn’t match expected file name " + filename);
                            ret += line + '\n';
                            cache[compilationUnit] = nameMismatch;
                            return;
                        }
                        cache[compilationUnit] = match.html_url;
                        ret += before + "([" + filename + ":" + linenum + "](" + match.html_url + "#L" + linenum + "))\n";
                    } else {
                        console.error(req.status + ": " + req.statusText);
                        console.error(req.responseText);
                        ret += line + '\n';
                    }
                }
            };
            req.error = function(e) {
                console.error(req.statusText);
                ret += line + '\n';
            };
            req.send(null);
        } else {
            ret += line + '\n';
        }
    });
    var footer = "<sup>Generated by [linkStacktrace](http://lucaswerkmeister.github.io/linkStacktrace/)</sup>\n";
    if (ret.indexOf(footer) == -1)
        ret += footer;
    ret = ret.slice(0, -1); // remove last newline
    return ret;
}
