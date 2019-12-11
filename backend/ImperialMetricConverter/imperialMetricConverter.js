let runner = require('./test-runner.js');

module.exports = (app) => {

   require('./fcctesting.js')(app);

   if(process.env.NODE_ENV==='test') {
      console.log('Running Tests...');
      setTimeout(function () {
         try {runner.run();}
         catch(e) 
         {
            let error = e;
            console.log('Tests are not valid:');
            console.log(error);
         }
      }, 1500)};

    app.route('/api/convert')
    .get(function (req, res){
      let input = req.query.input;

      let initNum = '';
      let c = 0;
      let rate = 0;
      let hasDivide = false;
      let fraction = '';

      while(c < input.length && ((input[c]>='0' && input[c]<='9') || input[c]=='.' || input[c]=='/'))
      {
          if(input[c]=='/' && !hasDivide)hasDivide = true;
          else if(hasDivide) fraction = fraction + input[c];
          else initNum = initNum + input[c];
          c++;
      }

      initNum = Number(initNum);
      if(fraction == '')fraction = '1';
      initNum/=Number(fraction);

      let initUnit = input.slice(c);
      let returnUnit = null;
      
      switch(initUnit)
      {
         case 'gal' :
            rate = 3.78541;
            returnUnit = 'L';
            break;
         case 'L' :
            rate = 1/3.78541;
            returnUnit = 'gal';
            break;
         case 'lbs' :
            rate = 0.453592;
            returnUnit = 'kg';
            break;
         case 'kg' :
            rate = 1/0.453592;
            returnUnit = 'lbs';
            break;
         case 'mi' :
            rate = 1.60934;
            returnUnit = 'km';
            break;
         case 'km' :
            rate = 1/1.60934;
            returnUnit = 'mi';
            break;
      }
      if(isNaN(initNum) && !returnUnit)return 'invalid number and unit';
      if(isNaN(initNum))return res.send('invalid number');
      if(!returnUnit)return res.send('invalid unit');

      let returnNum = initNum * rate;
      let returnString = `${initNum} ${initUnit} converts to ${returnNum.toFixed(5)} ${returnUnit}`;

      return res.json({initNum, initUnit, returnNum, returnUnit, returnString});
    });
}