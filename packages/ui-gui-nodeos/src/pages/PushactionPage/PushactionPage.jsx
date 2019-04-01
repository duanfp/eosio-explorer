import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {
  Card, CardBody, CardHeader,Row, Col, Form, FormGroup, Label, Button,
  Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Input
} from 'reactstrap';

import { pollingStart, pollingStop, smartContractNameSearch, actionDigestSet, updateActionToPush, actionPush } from './PushactionPageReducer';
import { CodeViewer, LoadingSpinner } from 'components';
import { StandardTemplate } from 'templates';
import { defaultSet } from 'reducers/permission';
import Actionhistory from './components/Actionhistory';

const updateAction = (event, action, callback) => {
  console.log(event.target.name);
  if (event.target.name === "smartContractName") { 
    action.act.account = event.target.value;
  } else if(event.target.name === "actionType") {
    action.act.name = event.target.value;
  }
  callback(action);
};

const PushactionPage = (props) => {

  useEffect(()=>{
    props.pollingStart();
    return () => { props.pollingStop() }
  }, [])

  const [ isOpenDropDown, toggleDropDown] = useState(false);
  let { permission: { isFetching, data }, defaultSet, pushactionPage: { data: { actionToPush, error }, action, actionDigest } } = props;
  let { list, defaultId } = data;
  
  let selectedPermission = list.find(permission => defaultId === permission._id);
  if(action.act.authorization)
    selectedPermission = list.find(p => p.account === action.act.authorization.actor && p.permission === action.act.authorization.permission) || selectedPermission;

  console.log(action);

  return (
    <StandardTemplate>
      <div className="PushactionPage animated fadeIn">
        <Row>
          <Col xs="12">
            <h2 className="pageTitle text-center mb-4">Push Action Page</h2>
          </Col>
        </Row>
        <Row>
          <Col xs="12">
            <Card>
              <CardHeader>
                Push Action
              </CardHeader>
              <CardBody>

              { error ?
                <div className="text-center">
                  <p className="text-danger">{JSON.stringify(error)}</p>
                  <Button color="primary" onClick={props.fetchStart}>Click to Reload</Button>
                </div>
              : isFetching ? (
                <LoadingSpinner />
              ) : (
              <Form className="form-horizontal">
                <FormGroup row>
                    <Col xs="3">
                      <Label><strong>Smart Contract Name</strong></Label>
                    </Col>
                    <Col xs="9">
                      <Input type="text" id="smartContractName" name="smartContractName" placeholder="Smart Contract Name..." 
                      value={action && (action.act && action.act.account)}
                      onChange={(e) => { updateAction(e, action, props.updateActionToPush) } } />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col xs="3">
                      <Label><strong>Action Type</strong></Label>
                    </Col>
                    <Col xs="9">
                      <Input type="text" id="actionType" name="actionType" placeholder="Action Type..." 
                      value={action && (action.act && action.act.name)}
                      onChange={(e) => { updateAction(e, action, props.updateActionToPush) } } />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col xs="3">
                      <Label><strong>Permission</strong></Label>
                    </Col>
                    <Col xs="9">
                      {/* <Input type="select" name="permission" id="permission" onChange={(e)=> defaultSet(e.target.value) } value={selectedPermission._id}>
                        { list.map((permission) =>
                          <option key={permission._id} value={permission._id}>{permission.account}@{permission.permission}</option>
                        )}
                      </Input> */}
                      {/* <p>{action && (action.act && (action.act.authorization && ( JSON.stringify(action.act.authorization) )))}</p> */}
                          {console.log(JSON.stringify(selectedPermission))}
                      <Input type="select" name="permission" id="permission" onChange={(e)=> defaultSet(e.target.value)} value={selectedPermission._id}>
                        { list.map((permission) =>
                          <option key={permission._id} value={permission._id}>{permission.account}@{permission.permission}</option>
                        )}
                      </Input>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col xs="12">
                      <Label><strong>Payload</strong></Label>
                    </Col>
                    <Col xs="12">
                      <CodeViewer readOnly={false} height="300" value={JSON.stringify(action.payload, null, 2)} />
                    </Col>
                  </FormGroup>
                  <FormGroup row className="mb-0">
                    <Col xs="12" className="text-right">
                      <Button onClick={(e) => { props.actionPush(action) }} color="primary">Push</Button>
                    </Col>
                  </FormGroup>
                </Form>
              )}
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col xs="12">
            <Card>
              <CardHeader>
                Action History Viewer
              </CardHeader>
              <CardBody>
                <Actionhistory prefillCallback={(act_digest) => { props.actionDigestSet(act_digest); window.scrollTo(0, 0); } } />
              </CardBody>
            </Card>
          </Col>
        </Row>
        {/* <Row>
          <Col xs="12">
            <Dropdown isOpen={isOpenDropDown} toggle={()=>{toggleDropDown(!isOpenDropDown)}}>
              <DropdownToggle caret>
                  { list.map((permission) => defaultId === permission._id && `${permission.account}@${permission.permission}`) }
              </DropdownToggle>
              <DropdownMenu right>
                  { list.map((permission)=><DropdownItem key={permission._id} onClick={()=>{ defaultSet(permission._id)}}>{`${permission.account}@${permission.permission}`}</DropdownItem>) }
              </DropdownMenu>
            </Dropdown>
          </Col>
        </Row> */}
      </div>
    </StandardTemplate>
  );
}

export default connect(
  ({ permission, pushactionPage }) => ({
    permission,
    pushactionPage
  }),
  {
    defaultSet,
    pollingStart,
    pollingStop,
    smartContractNameSearch,
    actionDigestSet,
    updateActionToPush,
    actionPush
  }

)(PushactionPage);
