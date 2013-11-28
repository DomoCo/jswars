package warserver

import (
    "html/template"
    "warserver/logger"
    "net/http"
    "regexp"
)

// matches for urls which contain file name extensions, ie static files
var static_regex = regexp.MustCompile("/([^/]*\\.[^/]*)$"); 

func serveIndex(w http.ResponseWriter, r *http.Request) {
    // check for and process static file requests
    matches := static_regex.FindStringSubmatch(r.URL.Path)
    if (len(matches) > 0) {
        static_http.ServeHTTP(w, r)
        logger.Debugf("Static fetch for resource: %s", r.URL.Path)
    } else {
        // return the index.html
        t, err := template.ParseFiles("index.html")
        if (err != nil) {
            panic(err)
        }
        t.Execute(w, "")
        logger.Debug("Fetch for home page")
    }
}
