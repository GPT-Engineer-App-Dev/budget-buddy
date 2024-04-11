import React, { useState } from "react";
import { Box, Heading, Input, Button, Select, Table, Thead, Tbody, Tr, Th, Td, IconButton, Flex, Text } from "@chakra-ui/react";
import { FaPlus, FaEdit, FaTrash, FaFilter, FaFileExport } from "react-icons/fa";

const Index = () => {
  const [transactions, setTransactions] = useState([]);
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("income");
  const [category, setCategory] = useState("salary");
  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");
  const [editIndex, setEditIndex] = useState(-1);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editIndex === -1) {
      setTransactions([...transactions, { date, amount: +amount, type, category }]);
    } else {
      const newTransactions = [...transactions];
      newTransactions[editIndex] = { date, amount: +amount, type, category };
      setTransactions(newTransactions);
      setEditIndex(-1);
    }
    setDate("");
    setAmount("");
    setType("income");
    setCategory("salary");
  };

  const handleEdit = (index) => {
    const { date, amount, type, category } = transactions[index];
    setDate(date);
    setAmount(amount);
    setType(type);
    setCategory(category);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    setTransactions(transactions.filter((_, i) => i !== index));
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesType = filterType === "all" || transaction.type === filterType;
    const matchesCategory = filterCategory === "all" || transaction.category === filterCategory;
    const afterStartDate = !filterStartDate || transaction.date >= filterStartDate;
    const beforeEndDate = !filterEndDate || transaction.date <= filterEndDate;
    return matchesType && matchesCategory && afterStartDate && beforeEndDate;
  });

  const balance = transactions.reduce((acc, transaction) => (transaction.type === "income" ? acc + transaction.amount : acc - transaction.amount), 0);

  const exportTransactions = () => {
    const data = JSON.stringify(transactions, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "transactions.json";
    link.href = url;
    link.click();
  };

  return (
    <Box maxWidth="800px" margin="auto" padding="20px">
      <Heading as="h1" size="xl" textAlign="center" marginBottom="20px">
        Budget App
      </Heading>
      <form onSubmit={handleSubmit}>
        <Flex gap="10px" marginBottom="20px">
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" required />
          <Select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </Select>
          <Select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="salary">Salary</option>
            <option value="bills">Bills</option>
            <option value="groceries">Groceries</option>
            <option value="other">Other</option>
          </Select>
          <Button type="submit" colorScheme="blue" leftIcon={<FaPlus />} width="full">
            {editIndex === -1 ? "Add" : "Update"}
          </Button>
        </Flex>
      </form>
      <Flex gap="10px" marginBottom="20px">
        <Select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </Select>
        <Select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
          <option value="all">All Categories</option>
          <option value="salary">Salary</option>
          <option value="bills">Bills</option>
          <option value="groceries">Groceries</option>
          <option value="other">Other</option>
        </Select>
        <Input type="date" value={filterStartDate} onChange={(e) => setFilterStartDate(e.target.value)} placeholder="Start Date" />
        <Input type="date" value={filterEndDate} onChange={(e) => setFilterEndDate(e.target.value)} placeholder="End Date" />
        <IconButton
          icon={<FaFilter />}
          aria-label="Filter"
          onClick={() => {
            setFilterType("all");
            setFilterCategory("all");
            setFilterStartDate("");
            setFilterEndDate("");
          }}
        />
        <IconButton icon={<FaFileExport />} aria-label="Export" onClick={exportTransactions} />
      </Flex>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Date</Th>
            <Th>Amount</Th>
            <Th>Type</Th>
            <Th>Category</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredTransactions.map((transaction, index) => (
            <Tr key={index}>
              <Td>{transaction.date}</Td>
              <Td>{transaction.amount}</Td>
              <Td>{transaction.type}</Td>
              <Td>{transaction.category}</Td>
              <Td>
                <IconButton icon={<FaEdit />} aria-label="Edit" onClick={() => handleEdit(index)} marginRight="10px" />
                <IconButton icon={<FaTrash />} aria-label="Delete" onClick={() => handleDelete(index)} />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Text fontSize="2xl" marginTop="20px">
        Balance: {balance}
      </Text>
    </Box>
  );
};

export default Index;
