# Baserow Client

The Baserow Client is a TypeScript library that provides convenient methods for interacting with the Baserow application. It allows you to perform various operations such as listing records, retrieving records, creating new records, editing existing records, moving records, and deleting records.

## Installation

Install the Baserow SDK Client using npm:

```bash
npm install baserow-client
```

## Usage

Import the Baserow SDK Client in your TypeScript file:

```typescript
import Baserow from 'baserow-client';
```

### Creating a Baserow instance

To use the Baserow SDK Client, you need to create a `Baserow` instance by providing your API key. Optionally, you can specify whether to show user field names.  
Here's an example:

```typescript
const baserow = new Baserow({
  apiKey: 'YOUR_API_KEY',
  showUserFieldNames: true,
});
```

For self-hosted instances - add `apiUrl`:

```typescript
const baserow = new Baserow({
  apiKey: 'YOUR_API_KEY',
  apiUrl: 'https://SELF_HOSTED_INSTANCE_DOMAIN',
});
```

### Accessing a Baserow table

To interact with a specific table in the Baserow application, use the `table` method on the `Baserow` instance. Pass the table ID as an argument. This will return a `BaserowTable` instance that provides various methods for performing operations on the table. If you provide generic type to `table`, you get strong typings on methods behind. Here's an example:

```typescript
const table = baserow.table<Item>(tableID);
```

### Listing records

To retrieve a list of records from the Baserow table, use the `list` method on the `BaserowTable` instance. You can specify various parameters such as page number, page size, search query, order by field, and order direction. The method returns a promise that resolves to an array of `BaserowRecord` instances. Here's an example:

```typescript
interface Item {
  Name: string;
  Age: number;
  Email: string;
}

const params: BaserowListParams<Item> = {
  page: 1,
  size: 20,
  search: 'example',
  orderBy: 'Name',
  orderDir: 'ASC',
};

table
  .list(params)
  .then((records) => {
    // Process the list of records
  })
  .catch((error) => {
    // Handle the error
  });
```

### Retrieving a record

To retrieve a single record from the Baserow table by its ID, use the `get` method on the `BaserowTable` instance. Pass the record ID as an argument. The method returns a promise that resolves to a `BaserowRecord` instance. Here's an example:

```typescript
table
  .get(recordID)
  .then((record) => {
    // Process the record
  })
  .catch((error) => {
    // Handle the error
  });
```

### Creating a record

To create a new record in the Baserow table, use the `create` method on the `BaserowTable` instance. Pass a fields object that contains the values for each field in the record. The method returns a promise that resolves to a `BaserowRecord` instance representing the newly created record. Here's an example:

```typescript
interface Item {
  Name: string;
  Age: number;
  Email: string;
}

const fields: Item = {
  Name: 'John Doe',
  Age: 30,
  Email: 'john@example.com',
};

table
  .create(fields)
  .then((record) => {
    // Process the created record
  })
  .catch((error) => {
    // Handle the error
  });
```

### Editing a record

To edit an existing record in the Baserow table, use the `update` method on the `BaserowTable` instance. Pass the record ID and a

fields object that contains the updated values for the record. The method returns a promise that resolves to a `BaserowRecord` instance representing the updated record. Here's an example:

```typescript
interface Item {
  Name: string;
  Age: number;
  Email: string;
}

const fields: Item = {
  Name: 'Updated Name',
  Age: 40,
  Email: 'updated@example.com',
};

table
  .update(recordID, fields)
  .then((record) => {
    // Process the updated record
  })
  .catch((error) => {
    // Handle the error
  });
```

### Moving a record

To move a record within the Baserow table, use the `move` method on the `BaserowTable` instance. Pass the record ID and the ID of the record before which you want to move the record. The method returns a promise that resolves to a `BaserowRecord` instance representing the moved record. Here's an example:

```typescript
table
  .move(recordID, beforeRecordID)
  .then((record) => {
    // Process the moved record
  })
  .catch((error) => {
    // Handle the error
  });
```

### Deleting a record

To delete a record from the Baserow table, use the `delete` method on the `BaserowTable` instance. Pass the record ID as an argument. The method returns a promise that resolves to a `BaserowRecord` instance representing the deleted record. Here's an example:

```typescript
table
  .delete(recordID)
  .then((record) => {
    // Process the deleted record
  })
  .catch((error) => {
    // Handle the error
  });
```

## License

This project is licensed under the [MIT License](LICENSE).

## Contributing

Contributions are welcome!
