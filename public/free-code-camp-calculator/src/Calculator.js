import React, {Component} from 'react';
import Screen from './Screen';
import Button from './Button';

class Calculator extends Component
{

    constructor(props)
    {
        super(props);
        this.state = {
            current: "0",
            tokens: []
        };
    }

    display()
    {
        let d = "";
        for(let token of this.state.tokens)
            d+=token+" ";
        return d + this.state.current;
    }

    isOperator(ch)
    {
        return (ch==="×" || ch==="/" || ch==="-" || ch==="+");
    }

    calculate()
    {
        let tokens = this.state.tokens;

            for(let i=0; i<tokens.length; i++)
                if(tokens[i]==='×')
                {
                    tokens.splice(i-1,3,Number(tokens[i-1])*Number(tokens[i+1]));
                    i=-1;
                }
                else if(tokens[i]==='/')
                {
                    tokens.splice(i-1,3,Number(tokens[i-1])/Number(tokens[i+1]));
                    i=-1;
                }
            
            for(let i=0; i<tokens.length; i++)
                if(tokens[i]==='+')
                {
                    tokens.splice(i-1,3,Number(tokens[i-1])+Number(tokens[i+1]));
                    i=-1;
                }
                else if(tokens[i]==='-')
                {
                    tokens.splice(i-1,3,Number(tokens[i-1])-Number(tokens[i+1]));
                    i=-1;
                }
            
        return tokens[0];
    }

    buttonClick = (c) =>
    {
        let {current, tokens} = this.state;

        if(c==="C")this.setState({display: "0", current: "0", tokens: []});
        else if(this.isOperator(c))
        {
            if(this.isOperator(current))this.setState({current: c});
            else
            {
                tokens.push(current);
                current = c;
                this.setState({tokens, current});
            }
        }
        else if(c === ".")
        {
            if(this.isOperator(current))
            {
                tokens.push(current);
                current = "0.";
                this.setState({tokens, current});
            }
            else if((""+current).indexOf(".")===-1)this.setState({current: current + "."});   
        }
        else if(c === "=")
        {
            tokens.push(current);
            current = this.calculate();
            this.setState({tokens: [], current});
        }
        else
        {
            if(this.isOperator(current))
            {
                tokens.push(current);
                current = c;
                this.setState({tokens, current});
            }
            else if((""+current).indexOf(".")===-1)this.setState({current: parseInt(current+c,10)});
            else this.setState({current: current+c});
        }
    }

    render()
    {
        return (
            <div className="container-fluid">
                <div className="row">
                    <Screen display={this.display()}/>
                </div>

                <div className="row">
                    <Button value="C" id="clear" buttonClick={this.buttonClick} additionalClassNames=" btn-outline-danger" sz="-6"/>
                    <Button value="/" id="divide" buttonClick={this.buttonClick} additionalClassNames=" btn-outline-danger"/>
                    <Button value="×" id="multiply" buttonClick={this.buttonClick} additionalClassNames=" btn-outline-danger"/>
                </div>

                <div className="row">
                    <Button value="7" id="seven" buttonClick={this.buttonClick} additionalClassNames=" btn-outline-primary"/>
                    <Button value="8" id="eight" buttonClick={this.buttonClick} additionalClassNames=" btn-outline-primary"/>
                    <Button value="9" id="nine" buttonClick={this.buttonClick} additionalClassNames=" btn-outline-primary"/>
                    <Button value="+" id="add" buttonClick={this.buttonClick} additionalClassNames=" btn-outline-danger"/>
                </div>

                <div className="row">
                    <Button value="4" id="four" buttonClick={this.buttonClick} additionalClassNames=" btn-outline-primary"/>
                    <Button value="5" id="five" buttonClick={this.buttonClick} additionalClassNames=" btn-outline-primary"/>
                    <Button value="6" id="six" buttonClick={this.buttonClick} additionalClassNames=" btn-outline-primary"/>
                    <Button value="-" id="subtract" buttonClick={this.buttonClick} additionalClassNames=" btn-outline-danger"/>
                </div>

                <div className="row" style={{minHeight: "100px"}}>
                    <div className="col-9 container-fluid h-100">
                        <div className="row">
                            <Button value="1" id="one" buttonClick={this.buttonClick} additionalClassNames=" btn-outline-primary"/>
                            <Button value="2" id="two" buttonClick={this.buttonClick} additionalClassNames=" btn-outline-primary"/>
                            <Button value="3" id="three" buttonClick={this.buttonClick} additionalClassNames=" btn-outline-primary"/>
                        </div>
                        <div className="row">
                            <Button value="0" id="zero" buttonClick={this.buttonClick} additionalClassNames=" btn-outline-primary" sz="-8"/>
                            <Button value="." id="decimal" buttonClick={this.buttonClick} additionalClassNames=" btn-outline-danger" />
                        </div>
                    </div>
                    <div className="col container-fluid row" style={{height: "1000px !important"}}>
                        <Button value="=" id="equals" buttonClick={this.buttonClick} additionalClassNames=" btn-outline-danger"/>
                    </div>
                </div>
            </div>
        );
    }    
}


export default Calculator;
