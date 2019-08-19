import React, { Component } from 'react';

import Spinner from '../common/Spinner';
import TextFieldGroup from '../common/TextFieldGroup';
import SelectListGroup from '../common/SelectListGroup';
import EquipmentFieldGroup from '../common/EquipmentFieldGroup';

import {
  statusOptions,
  descriptionOptionsHFC,
  descriptionOptionsGPON,
  tvPackageOptions,
  internetPackageOptions
} from '../../utils/select-lists';

class CreateTicket extends Component {
  state = {
    ticketType: '',
    description: '',
    addTechnicians: false,
    status: '',
    leadsman: '',
    assistant: '',
    tvPackage: '',
    internetPackage: '',
    name: '',
    id: '',
    nin: '',
    address: '',
    parcelNumber: '',
    telephone1: '',
    telephone2: '',
    telephone3: '',
    addNumber2: false,
    addNumber3: false,
    email: '',
    nodeLocation: '',
    tnaLocation: '',
    le: '',
    tap: false,
    dB: '',
    psLocation: '',
    hubLocation: '',
    phone: false,
    phoneMac: '',
    phoneSerial: '',
    iptv: false,
    iptvMac: '',
    iptvSerial: '',
    vod: false,
    vodMac: '',
    vodSerial: '',
    dualView: false,
    dualViewMac: '',
    dualViewSerial: '',
    stbPet: false,
    stbPetMac: '',
    stbPetSerial: '',
    stbNeta: false,
    stbNetaMac: '',
    stbNetaSerial: '',
    ont2426: false,
    ont2426Mac: '',
    ont2426Serial: '',
    ont2424: false,
    ont2424Mac: '',
    ont2424Serial: '',
    technoColour: false,
    technoColourMac: '',
    technoColourSerial: '',
    errors: {}
  };

  componentDidMount() {
    const { role } = this.props.auth.currentUser;
    if (role === 'technician') {
      this.props.history.push('/dashboard');
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.errors !== this.props.errors) {
      this.setState({ errors: this.props.errors });
    }
  }

  onSubmit = event => {
    event.preventDefault();

    const newTicket = this.state;

    const { technicians } = this.props.technician;

    if (this.state.leadsman !== '') {
      const leadsman = technicians.find(
        technician => technician._id === this.state.leadsman
      );

      newTicket.leadsmanName = leadsman.name;
      newTicket.leadsmanHandle = leadsman.handle;
    }

    if (this.state.assistant !== '') {
      const assistant = technicians.find(
        technician => technician._id === this.state.assistant
      );
      newTicket.assistantName = assistant.name;
      newTicket.assistantHandle = assistant.handle;
    }
    this.props.createTicket(newTicket, this.props.history);
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onCheck = event => {
    const { name } = event.target;
    this.setState({ [name]: !this.state[name] });
  };

  onHFCClick = () => {
    this.setState({ ticketType: 'HFC' });
  };

  onGPONClick = () => {
    this.setState({ ticketType: 'GPON' });
  };

  getAvailableTechnicians = technicians => {
    const { leadsman } = this.state;
    if (leadsman !== '') {
      return technicians.filter(technician => technician._id !== leadsman);
    } else {
      return technicians;
    }
  };

  onAddTechniciansClick = event => {
    event.preventDefault();

    this.setState({ addTechnicians: true });
    this.props.getTechnicians();
  };

  onAddNumberClick = event => {
    event.preventDefault();

    if (this.state.telephone2 === '') {
      this.setState({ addNumber2: true });
    } else {
      this.setState({ addNumber3: true });
    }
  };

  render() {
    const { errors, ticketType, leadsman } = this.state;
    const { technicians, technicianLoading } = this.props.technician;
    const { currentUser } = this.props.auth;

    let ticketForm;
    let technicianFields;

    if (technicians === null || technicianLoading) {
      technicianFields = <Spinner />;
    } else {
      technicianFields = (
        <div>
          <SelectListGroup
            name="leadsman"
            value={this.state.leadsman}
            onChange={this.onChange}
            placeholderOption="Select a Leadsman"
            items={technicians.map(technician => ({
              label: technician.name,
              value: technician._id
            }))}
            fieldLabel={this.state.leadsman !== '' && 'Leadsman:'}
            error={errors.leadsman}
          />
          <SelectListGroup
            name="assistant"
            value={this.state.assistant}
            onChange={this.onChange}
            placeholderOption="Select an Assistant"
            items={this.getAvailableTechnicians(technicians).map(
              technician => ({
                label: technician.name,
                value: technician._id
              })
            )}
            disabled={leadsman === '' ? true : false}
            fieldLabel={this.state.assistant !== '' && 'Assistant:'}
            error={errors.assistant}
          />
          <SelectListGroup
            name="status"
            value={leadsman === '' ? 'Unassigned' : this.state.status}
            onChange={this.onChange}
            placeholderOption="Select Ticket Status *"
            items={
              leadsman === ''
                ? [{ label: 'Unassigned', value: 'Unassigned' }]
                : statusOptions
            }
            fieldLabel={this.state.status !== '' && 'Ticket Status:'}
            error={errors.status}
          />
        </div>
      );
    }

    if (ticketType === '') {
      ticketForm = <div />;
    } else {
      ticketForm = (
        <form onSubmit={this.onSubmit} noValidate>
          <SelectListGroup
            name="description"
            value={this.state.description}
            onChange={this.onChange}
            placeholderOption="Ticket Description *"
            items={
              ticketType === 'HFC'
                ? descriptionOptionsHFC
                : descriptionOptionsGPON
            }
            fieldLabel={this.state.description !== '' && 'Ticket Description:'}
            error={errors.description}
          />
          {currentUser.role === 'admin' && (
            <button
              onClick={this.onAddTechniciansClick}
              className="btn btn-secondary mb-3"
              disabled={this.state.addTechnicians && true}
            >
              Add Technicians
            </button>
          )}
          {this.state.addTechnicians && <div>{technicianFields}</div>}
          <SelectListGroup
            name="tvPackage"
            value={this.state.tvPackage}
            onChange={this.onChange}
            placeholderOption="Select TV Subscription"
            items={tvPackageOptions}
            fieldLabel={this.state.tvPackage !== '' && 'TV Subscription:'}
            error={errors.tvPackage}
          />
          <SelectListGroup
            name="internetPackage"
            value={this.state.internetPackage}
            onChange={this.onChange}
            placeholderOption="Select Internet Subscription"
            items={internetPackageOptions}
            fieldLabel={
              this.state.internetPackage !== '' && 'Internet Subscription:'
            }
            error={errors.internetPackage}
          />
          <br />
          <p className="lead">End User Information:</p>
          <TextFieldGroup
            placeholder="Customer Name *"
            name="name"
            value={this.state.name}
            onChange={this.onChange}
            label={this.state.name !== '' && 'Customer Name:'}
            error={errors.name}
          />
          <TextFieldGroup
            placeholder="Customer ID *"
            name="id"
            value={this.state.id}
            onChange={this.onChange}
            label={this.state.id !== '' && 'Customer ID:'}
            error={errors.id}
          />
          <TextFieldGroup
            placeholder="NIN *"
            name="nin"
            value={this.state.nin}
            onChange={this.onChange}
            label={this.state.nin !== '' && 'NIN:'}
            error={errors.nin}
          />
          <TextFieldGroup
            placeholder="Address *"
            name="address"
            value={this.state.address}
            onChange={this.onChange}
            label={this.state.address !== '' && 'Address:'}
            error={errors.address}
          />
          <TextFieldGroup
            placeholder="Parcel Number *"
            name="parcelNumber"
            value={this.state.parcelNumber}
            onChange={this.onChange}
            label={this.state.parcelNumber !== '' && 'Parcel Number:'}
            error={errors.parcelNumber}
          />
          {this.state.telephone1 !== '' && (
            <label className="text-muted">Telephone Number(s):</label>
          )}
          <div className="row">
            <div className="col-10">
              <TextFieldGroup
                placeholder="Telephone *"
                name="telephone1"
                value={this.state.telephone1}
                onChange={this.onChange}
                error={errors.telephone1}
              />
            </div>
            <div className="col-2">
              <button
                onClick={this.onAddNumberClick}
                className="btn btn-secondary btn-block"
                disabled={this.state.telephone1 === '' && true}
              >
                <i className="fas fa-plus" />
              </button>
            </div>
          </div>
          {this.state.addNumber2 === true && (
            <div className="row">
              <div className="col-10">
                <TextFieldGroup
                  placeholder="Telephone 2 (Optional)"
                  name="telephone2"
                  value={this.state.telephone2}
                  onChange={this.onChange}
                  error={errors.telephone2}
                />
              </div>
              <div className="col-2">
                <button
                  onClick={this.onAddNumberClick}
                  className="btn btn-secondary btn-block"
                  disabled={this.state.telephone2 === '' && true}
                >
                  <i className="fas fa-plus" />
                </button>
              </div>
            </div>
          )}
          {this.state.addNumber3 === true && (
            <TextFieldGroup
              placeholder="Telephone 3 (Optional)"
              name="telephone3"
              value={this.state.telephone3}
              onChange={this.onChange}
              error={errors.telephone3}
            />
          )}
          <TextFieldGroup
            placeholder="Email"
            name="email"
            type="email"
            value={this.state.email}
            onChange={this.onChange}
            label={this.state.email !== '' && 'Email:'}
            error={errors.email}
          />
          <br />
          <p className="lead">Network Information:</p>
          <TextFieldGroup
            placeholder="Node Location"
            name="nodeLocation"
            value={this.state.nodeLocation}
            onChange={this.onChange}
            label={this.state.nodeLocation !== '' && 'Node Location:'}
            error={errors.nodeLocation}
          />
          <TextFieldGroup
            placeholder="T.N.A. Location"
            name="tnaLocation"
            value={this.state.tnaLocation}
            onChange={this.onChange}
            label={this.state.tnaLocation !== '' && 'T.N.A. Location:'}
            error={errors.tnaLocation}
          />
          <TextFieldGroup
            placeholder="L.E."
            name="le"
            value={this.state.le}
            onChange={this.onChange}
            label={this.state.le !== '' && 'L.E.:'}
            error={errors.le}
          />
          <div className="row">
            <div className="col-2 form-check pl-5 mt-1">
              <input
                type="checkbox"
                className="form-check-input"
                name="tap"
                value={this.state.tap}
                checked={this.state.tap}
                onChange={this.onCheck}
                id="tap"
              />
              <label htmlFor="tap" className="text-muted form-check-label">
                Tap
              </label>
            </div>
            <div className="col-10">
              <TextFieldGroup
                placeholder="dB"
                name="dB"
                value={!this.state.tap ? '' : this.state.dB}
                onChange={this.onChange}
                disabled={!this.state.tap && true}
                error={errors.dB}
              />
            </div>
          </div>
          <TextFieldGroup
            placeholder="P.S. Location"
            name="psLocation"
            value={this.state.psLocation}
            onChange={this.onChange}
            label={this.state.psLocation !== '' && 'P.S. Location:'}
            error={errors.psLocation}
          />
          <TextFieldGroup
            placeholder="Hub Location"
            name="hubLocation"
            value={this.state.hubLocation}
            onChange={this.onChange}
            label={this.state.hubLocation !== '' && 'Hub Location:'}
            error={errors.hubLocation}
          />
          <br />
          <p className="lead">Equipment:</p>
          <EquipmentFieldGroup
            name="phone"
            nameMac="phoneMac"
            nameSerial="phoneSerial"
            value={this.state.phone}
            valueMac={this.state.phoneMac}
            valueSerial={this.state.phoneSerial}
            label="Phone"
            onCheck={this.onCheck}
            onChange={this.onChange}
          />
          <EquipmentFieldGroup
            name="iptv"
            nameMac="iptvMac"
            nameSerial="iptvSerial"
            value={this.state.iptv}
            valueMac={this.state.iptvMac}
            valueSerial={this.state.iptvSerial}
            label="IPTV"
            onCheck={this.onCheck}
            onChange={this.onChange}
          />
          <EquipmentFieldGroup
            name="vod"
            nameMac="vodMac"
            nameSerial="vodSerial"
            value={this.state.vod}
            valueMac={this.state.vodMac}
            valueSerial={this.state.vodSerial}
            label="VOD"
            onCheck={this.onCheck}
            onChange={this.onChange}
          />
          <EquipmentFieldGroup
            name="dualView"
            nameMac="dualViewMac"
            nameSerial="dualViewSerial"
            value={this.state.dualView}
            valueMac={this.state.dualViewMac}
            valueSerial={this.state.dualViewSerial}
            label="Dual View"
            onCheck={this.onCheck}
            onChange={this.onChange}
          />
          <EquipmentFieldGroup
            name="stbPet"
            nameMac="stbPetMac"
            nameSerial="stbPetSerial"
            value={this.state.stbPet}
            valueMac={this.state.stbPetMac}
            valueSerial={this.state.stbPetSerial}
            label="STB PET"
            onCheck={this.onCheck}
            onChange={this.onChange}
          />
          <EquipmentFieldGroup
            name="stbNeta"
            nameMac="stbNetaMac"
            nameSerial="stbNetaSerial"
            value={this.state.stbNeta}
            valueMac={this.state.stbNetaMac}
            valueSerial={this.state.stbNetaSerial}
            label="STB NETA"
            onCheck={this.onCheck}
            onChange={this.onChange}
          />
          <EquipmentFieldGroup
            name="ont2426"
            nameMac="ont2426Mac"
            nameSerial="ont2426Serial"
            value={this.state.ont2426}
            valueMac={this.state.ont2426Mac}
            valueSerial={this.state.ont2426Serial}
            label="ONT 2426"
            onCheck={this.onCheck}
            onChange={this.onChange}
          />
          <EquipmentFieldGroup
            name="ont2424"
            nameMac="ont2424Mac"
            nameSerial="ont2424Serial"
            value={this.state.ont2424}
            valueMac={this.state.ont2424Mac}
            valueSerial={this.state.ont2424Serial}
            label="ONT 2424"
            onCheck={this.onCheck}
            onChange={this.onChange}
          />
          <EquipmentFieldGroup
            name="technoColour"
            nameMac="technoColourMac"
            nameSerial="technoColourSerial"
            value={this.state.technoColour}
            valueMac={this.state.technoColourMac}
            valueSerial={this.state.technoColourSerial}
            label="Techno Colour"
            onCheck={this.onCheck}
            onChange={this.onChange}
          />
          <input type="submit" className="btn btn-info btn-block mt-4" />
        </form>
      );
    }

    return (
      <div className="create-ticket">
        <div className="container">
          <div className="row mt-4">
            <div className="col-md-12">
              <button
                onClick={() => this.props.history.goBack()}
                className="btn btn-light mb-2"
              >
                Go Back
              </button>
            </div>
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Create Ticket</h1>
              <p className="lead text-center">
                Enter new ticket details and submit
              </p>
              <small className="d-block pb-3 text-center">
                * indicates required fields
              </small>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 m-auto">
              <p className="lead">Select ticket type:</p>
              <div className="btn-group" role="group">
                <button
                  onClick={this.onHFCClick}
                  className={`btn ${
                    this.state.ticketType === 'HFC'
                      ? 'btn-dark'
                      : 'btn-secondary'
                  } mb-3`}
                >
                  HFC
                </button>
                <button
                  onClick={this.onGPONClick}
                  className={`btn ${
                    this.state.ticketType === 'GPON'
                      ? 'btn-dark'
                      : 'btn-secondary'
                  } mb-3`}
                >
                  GPON
                </button>
              </div>
              {this.state.ticketType !== '' && (
                <p className="lead">
                  Ticket type: <strong>{this.state.ticketType}</strong>
                </p>
              )}
              {ticketForm}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CreateTicket;
