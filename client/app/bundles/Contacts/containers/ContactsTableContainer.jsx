import React, { PropTypes } from 'react';
import ContactsTable from '../components/ContactsTable';
import axios from 'axios';

export default class ContactsTableContainer extends React.Component {
  static propTypes = {
    contacts: PropTypes.array.isRequired, // this is passed from the Rails view
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      contacts: props.contacts,
      dotComOnly: false,
      extensionOnly: false,
      internationalOnly: false
     };

    this.sortBy = this.sortBy.bind(this);
    this.sortByDotComOnly = this.sortByDotComOnly.bind(this);
    this.sortByExtensionOnly = this.sortByExtensionOnly.bind(this);
    this.sortByInternationalOnly = this.sortByInternationalOnly.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }
  // handle sorting alphabetically - just specify item to sort as argument
  sortBy(key) {
    const contacts = this.state.contacts;
    const sorted = this.state.contacts.sort((contactA, contactB) => {
      return contactA[key] >= contactB[key] ? 1 : -1;
    });

    this.setState({ contacts: sorted });
  }
  // sorting by dot com emails
  sortByDotComOnly(e) {
    const dotComOnly = !this.state.dotComOnly;

    const contacts = this.props.contacts.filter(contact => {
      return contact.email_address.endsWith('.com');
    })

    this.setState({
      dotComOnly,
      contacts
    })
  }
  // sorting by numbers with extensions
  sortByExtensionOnly(e) {
    const extensionOnly = !this.state.extensionOnly;

    const contacts = this.props.contacts.filter(contact => {
      return contact.phone_number.includes('x');
    })

    this.setState({
      extensionOnly,
      contacts
    })
  }
  // sorting by international numbers
  sortByInternationalOnly(e) {
    const internationalOnly = !this.state.internationalOnly;

    const contacts = this.props.contacts.filter(contact => {
      return contact.phone_number.startsWith('1-');
    })

    this.setState({
      internationalOnly,
      contacts
    })
  }

  // delete contact with axios and ajax
  handleDelete(contact) {
    axios.delete(`/contacts/${contact.id}`);
    const contacts = this.state.contacts.filter(c => c.id !== contact.id);
    this.setState({ contacts });
  }

  // display filters on the DOM
  render() {
    const { contacts, dotComOnly, extensionOnly, internationalOnly } = this.state;

    return (
      <div>
        <div className="filters">
          <button
            onClick={() => this.sortBy('email_address')}
          >
            Sort by email
          </button>
          <button
            onClick={this.sortByDotComOnly}
          >
            .com emails only
          </button>
          <button
            onClick={this.sortByExtensionOnly}
          >
            extensions only
          </button>
          <button
            onClick={this.sortByInternationalOnly}
          >
            international only
          </button>
        </div>

        <ContactsTable
         onDelete={this.handleDelete}
         contacts={contacts}
        />
      </div>
    );
  }
}
