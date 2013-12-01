function linkStacktrace(oauthToken, stackTrace, userOrRepo) {
    var ret = "";
    var notFound = {};
    var ambiguous = {};
    var cache = {}; // used to cache found files. key: before (see below), value: match.html_url (see further below) or notFound or ambiguous
    stackTrace.split('\n').forEach(function(line) {
        var parsedLine = /(.*)\((.*):(\d*)\)/.exec(line);
        if(parsedLine != null && typeof(parsedLine[1] == "string") && typeof(parsedLine[2] == "string") && typeof(parsedLine[3] == "string")) {
            var before = parsedLine[1];
            var filename = parsedLine[2];
            var linenum = parsedLine[3];
            if(before in cache) {
                if(typeof(cache[before]) === "string") {
                    ret += before + "([" + filename + ":" + linenum + "](" + cache[before] + "#L" + linenum + "))\n";
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
            req.onload = function(e) {
                if (req.readyState === 4) {
                    if (req.status === 200) {
                        var response = JSON.parse(req.responseText);
                        if(response.total_count === 0) {
                            console.log("file " + filename + " not found");
                            ret += line + '\n';
                            cache[before] = notFound;
                            return;
                        } else if(response.total_count > 1) {
                            console.log("file " + filename + " ambiguous");
                            ret += line + '\n';
                            cache[before] = ambiguous;
                            return;
                        }
                        // exactly one match
                        var match = response.items[0];
                        if(match.name != filename) {
                            console.log("file name " + match.name + " doesn’t match expected file name " + filename);
                            ret += line + '\n';
                            return;
                        }
                        cache[before] = match.html_url;
                        ret += before + "([" + filename + ":" + linenum + "](" + match.html_url + "#L" + linenum + "))\n";
                    } else {
                        console.error(req.statusText);
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
    return ret;
}
