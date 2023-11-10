const validatePost = (req, res, next) => {
    const errors = []

    const {category,title,readTime:{value,unit},author:{name},content } = req.body;

    if (typeof category !== 'string') {
        errors.push('Category must be a string') }

    if (typeof title !== 'string') {
        errors.push('Title must be a string') }

    if (typeof value !== 'number' && value !== '') {
        errors.push('Value must be a numbe') }

    if (typeof unit !== 'string') {
        errors.push('Unit must be a number') }

    if (typeof name !== 'string') {
        errors.push('Name must be a string') }
    
    if (typeof content !== 'string') {
        errors.push('Content must be a string') }

    if (errors.length > 0) {
        res.status(400).send({ errors } )
    } else {
        next() } }

module.exports = validatePost