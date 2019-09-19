import React from 'react'
import { Col, Row, InputGroup, FormControl, Button, Form } from 'react-bootstrap' 
import Spinner from './Spinner'

export default function UrlInput(props) {

    this.handleChange = e => {
        props.handleChange(e)
    }

    return (
            <>
                <InputGroup size="lg" className="mb-3" >
                    <FormControl
                    onChange={this.handleChange}
                    value={this.state.URL}
                    placeholder="Shorten your link"
                    aria-label="blabla"
                    aria-describedby="bla"
                    />

                    <InputGroup.Append>
                    {this.state.shortened ? 
                        <CopyToClipboard
                            text={this.state.URL}
                            onCopy={() => this.setCopiedTrue('main')}>
                            <Button variant={this.state.copied === 'main' ? "success" : "primary"}>{this.state.copied === 'main' ? "Copied" : "Copy"}</Button>
                        </CopyToClipboard>
                        :
                        <Button disabled={this.state.disabled} onClick={this.handleShorten}>{this.state.loading ? spinner : "Shorten"}</Button>
                    }      
                    </InputGroup.Append>
                </InputGroup>  
            </>
    )
}
