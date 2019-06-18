function fileNotFound(req, res) {
    res.status(404).render('errors/404')
}

module.exports = {
    fileNotFound: fileNotFound
}