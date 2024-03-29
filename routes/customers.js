var express = require('express');
var router = express.Router();

//var authentication_md1 = require('../middlewares/authentication');
var session_store;
/*GET Customer page. */

router.get('/',function(req, res, next) {
    req.getConnection(function(err,connection){
        var query = connection.query('SELECT * FROM customer', function(err,rows){
            if(err)
            var errornya = ("Error Selecting : %s ",err);
            req.flash('msg_error', errornya);
            res.render('customer/list',{title:"Customers",data:rows,session_store:req.session});
        });
    });
});
module.exports = router;

router.post('/add',function(req, res, next){
    req.assert('name', 'Please fill the name').notEmpty();
    var errors = req.validationErrors();
    if(!errors){
        v_name = req.sanitize( 'name' ).escape().trim();
        v_email = req.sanitize( 'email' ).escape().trim();
        v_address = req.sanitize( 'address' ).escape().trim();
        v_phone = req.sanitize( 'phone' ).escape();

        var customer = {
            name: v_name,
            address: v_address,
            email: v_email,
            phone: v_phone
        }

        var insert_sql = 'INSERT INTO customer SET ?';
        req.getConnection(function(err,connection){
            var query = connection.query(insert_sql, customer, function(err, result){
                if(err){
                    var errors_detail = ("Error Inser : %s", err);
                    req.flash('msg_error', errors_detail);
                    res.render('customer/add-customer', 
                    {
                        name: req.param('name'), 
                        address: req.param('address'),
                        email: req.param('email'),
                        phone: req.param('phone'),
                    });
                }else{
                    req.flash('msg_info', 'Create customer success');
                    res.redirect('/customers');
                }
            });
        });
    }else{
        console.log(errors);
        errors_detail = "Sorry there are error <ul>";
        for (i in errors)
        {
            error = errors[i];
            errors_detail += '<li>' +error.msg+'<li>';
        }
        errors_detail += "<ul>";
        req.flash('msg_error', errors_detail);
        res.render('customer/add-customer',
        {
            name: req.param('name'),
            address: req.param('address')
        });
    }
});

router.get('/add',function(req, res, next){
    res.render('customer/add-customer',
    {
        title: 'Add New Customer',
        name: '',
        email: '',
        phone: '',
        address: ''
    });
});

router.get('/edit/(:id)',function(req,res,next){
    req.getConnection(function(err,connection){
        var query = connection.query('SELECT * FROM customer WHERE id='+req.params.id, function(err,rows)
        {
            if(err)
            {
                var errornya = ("Error Selecting : %s ",err);
                req.flash('msg_error', errors_detail);
                res.redirect('/customers');
            }else{
                if(rows.length <=0)
                {
                    req.flash('msg_error', "Customer can't be find!");
                    res.redirect('/customers');
                }else{
                    console.log(rows);
                    res.render('customer/edit',{title:"Edit",data:rows[0]});
                }
            }
        });
    });
});

router.put('/edit/(:id)',function(req,res,next){
    req.assert('name', 'Please fill the name').notEmpty();
    var errors = req.validationErrors();
    if(!errors){
        v_name = req.sanitize( 'name' ).escape().trim();
        v_email = req.sanitize( 'email' ).escape().trim();
        v_address = req.sanitize( 'address' ).escape().trim();
        v_phone = req.sanitize( 'phone' ).escape();

        var customer = {
            name: v_name,
            address: v_address,
            email: v_email,
            phone: v_phone
        }

        var update_sql = 'UPDATE customer SET ? WHERE id ='+req.params.id;
        req.getConnection(function(err,connection){
            var query = connection.query(update_sql, customer, function(err, result){
                if(err)
                {
                    var errors_detail = ("Error Update : %s ",err);
                    req.flash('msg_error', errors_detail);
                    res.render('customer/edit', 
                    {
                        name: req.param('name'), 
                        address: req.param('address'),
                        email: req.param('email'),
                        phone: req.param('phone'),
                    });
                }else{
                    req.flash('msg_info', 'Update customer success');
                    res.redirect('/customers/edit/'+req.params.id);
                }
            });
        });
    }else{
        console.log(errors);
        errors_detail = "Sorry there are error<ul>";
        for (i in errors)
        {
            error = errors[i];
            errors_detail += '<li>'+error.msg+'<li>';
        }
        errors_detail += "</ul>";
        req.flash('msg_error', errors_detail);
        res.render('customer/add-customer',
        {
            name: req.param('name'),
            address: req.param('address')
        });
    }
});

router.delete('/delete/(:id)',function(req, res, next){
    req.getConnection(function(err, connection){
        var customer = {
            id: req.params.id,
        }

        var delete_sql = 'DELETE FROM customer WHERE ?';
        req.getConnection(function(err,connection){
            var query = connection.query(delete_sql, customer, function(err, result){
                if(err)
                {
                    var errors_detail = ("Error Delete : %s ",err);
                    req.flash('msg_error', errors_detail);
                    res.render('/customers');
                }else{
                    req.flash('msg_info', 'Delete customer success');
                    res.redirect('/customers');
                }
            });
        });
    });
});