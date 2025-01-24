import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

export default function Topuser() {
  return (
    <div className="w-full border p-5 mb-28 rounded-lg mx-auto">
    <Tabs defaultValue="account" className="w-full text-center">
    <TabsList>
      <TabsTrigger value="account">Team</TabsTrigger>
      <TabsTrigger value="password">Event</TabsTrigger>
    </TabsList>
    <TabsContent value="account">

    <Table>
  <TableCaption>A list of Top Team Joinee</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead className="w-[100px]">Invoice</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Method</TableHead>
      <TableHead className="text-right">Amount</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell className="font-medium">INV001</TableCell>
      <TableCell>Paid</TableCell>
      <TableCell>Credit Card</TableCell>
      <TableCell className="text-right">$250.00</TableCell>
    </TableRow>
    <TableRow>
      <TableCell className="font-medium">INV002</TableCell>
      <TableCell>Pending</TableCell>
      <TableCell>PayPal</TableCell>
      <TableCell className="text-right">$150.00</TableCell>
    </TableRow>
    <TableRow>
      <TableCell className="font-medium">INV003</TableCell>
      <TableCell>Paid</TableCell>
      <TableCell>Bank Transfer</TableCell>
      <TableCell className="text-right">$300.00</TableCell>
    </TableRow>
  </TableBody>
</Table>

</TabsContent>
    <TabsContent value="password">
        
        <Table>
  <TableCaption>A list of Top Event Joinee</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead className="w-[100px]">Invoice</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Method</TableHead>
      <TableHead className="text-right">Amount</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell className="font-medium">INV001</TableCell>
      <TableCell>Paid</TableCell>
      <TableCell>Credit Card</TableCell>
      <TableCell className="text-right">$250.00</TableCell>
    </TableRow>
    <TableRow>
      <TableCell className="font-medium">INV002</TableCell>
      <TableCell>Pending</TableCell>
      <TableCell>PayPal</TableCell>
      <TableCell className="text-right">$150.00</TableCell>
    </TableRow>

    <TableRow>
      <TableCell className="font-medium">INV003</TableCell>
      <TableCell>Paid</TableCell>
      <TableCell>Bank Transfer</TableCell>
      <TableCell className="text-right">$300.00</TableCell>
    </TableRow>

    <TableRow>
      <TableCell className="font-medium">INV003</TableCell>
      <TableCell>Due</TableCell>
      <TableCell>Wire Transfer</TableCell>
      <TableCell className="text-right">$200.00</TableCell>
    </TableRow>

  </TableBody>
</Table>

</TabsContent>
  </Tabs>
  </div>
  
  )
}
