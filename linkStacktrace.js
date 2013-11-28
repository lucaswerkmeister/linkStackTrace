function linkStacktrace(oauthToken, stackTrace, repo) {
    var ret = "";
    stackTrace.split('\n').forEach(function(line) {
        var parsedLine = /(.*)\((.*):(\d*)\)/.exec(line);
        if(parsedLine != null && typeof(parsedLine[1] == "string") && typeof(parsedLine[2] == "string") && typeof(parsedLine[3] == "string")) {
            var before = parsedLine[1];
            var filename = parsedLine[2];
            var linenum = parsedLine[3];
            var req = new XMLHttpRequest();
            req.open("GET", "https://api.github.com/search/code?" + 
                "access_token=" + oauthToken +
                "q=" + filename + "+in:path+repo:" + repo + 
                "&per_page=2", true);
            req.onload = function(e) {
                if (req.readyState === 4) {
                    if (req.status === 200) {
                        var response = JSON.parse(req.responseText);
                        if(response.total_count === 0) {
                            console.log("file " + filename + " not found");
                            ret += line + '\n';
                            return;
                        } else if(response.total_count > 1) {
                            console.log("file " + filename + " ambiguous");
                            ret += line + '\n';
                            return;
                        }
                        // exactly one match
                        var match = response.items[0];
                        if(match.name != file) {
                            console.log("file name " + match.name + " doesn’t match expected file name " + filename);
                            ret += line + '\n';
                            return;
                        }
                        ret += before + "([" + filename + ":" + linenum + "](" + match.html_url + "#L" + linenum + "))\n";
                    } else {
                        console.error(req.statusText);
                        console.error(req.responseText);
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
}
