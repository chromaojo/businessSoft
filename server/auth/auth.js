
const AvoidIndex = (req, res, next)=>{
    
    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    req.app.set('userData', userCookie);
    
    if (!userCookie){
        
        return next();
       
        
    } else{
         if (userCookie.role == 'admin') {
            return res.redirect('/admin/dashboard');
         } else {
            return res.redirect('/user/dashboard');
         }
    }
};

const UserLoggin = (req, res, next)=>{
    
    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    req.app.set('userData', userCookie);
    
    if (userCookie){
        return next();
        
    } else{
        return res.status(401).redirect('/logout');
    }
};

const AdminRoleBased = (req, res, next)=>{
    
    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    req.app.set('userData', userCookie);
    
    if (userCookie.role === "admin"){
        return next();
        
    } else{
        const userData = userCookie;
        const error = 'You are unauthorized for this access'
        res.render('error', { userData, error })
        // return res.status(401).redirect('/user/logout');
    }
};

module.exports = {UserLoggin, AvoidIndex, AdminRoleBased}