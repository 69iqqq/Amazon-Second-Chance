"use client";

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

export default function AnalyticalDashboardPage() {
  const dummyMetrics = [
    { 
      title: 'Total Views', 
      value: '124,592', 
      change: '+14%', 
      color: 'text-blue-600',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#007185" strokeWidth="1.2" className="w-8 h-8">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" fill="#eaeded" />
          <circle cx="12" cy="12" r="4" fill="#007185" stroke="none" />
          <circle cx="12" cy="12" r="1.5" fill="#ff9900" stroke="none" />
        </svg>
      )
    },
    { 
      title: 'Total Buys', 
      value: '1,230', 
      change: '+5%', 
      color: 'text-green-600',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#007185" strokeWidth="1.2" className="w-8 h-8">
          <path d="M6 8h12l1 12H5L6 8z" fill="#eaeded" />
          <path d="M9 8V5a3 3 0 0 1 6 0v3" />
          <circle cx="12" cy="13" r="4" fill="#ff9900" stroke="none" />
          <path d="M10 13l1.5 1.5 2.5-2.5" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    },
    { 
      title: 'Total Sales', 
      value: '₹4,52,000', 
      change: '+22%', 
      color: 'text-[#ff9900]',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#007185" strokeWidth="1.2" className="w-8 h-8">
          <rect x="2" y="6" width="20" height="12" rx="2" fill="#eaeded" />
          <circle cx="12" cy="12" r="4.5" fill="#ff9900" stroke="none" />
          <path d="M12 9.5v5M10.5 11h3m-3 2h3" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      )
    },
    { 
      title: 'Returns', 
      value: '45', 
      change: '-2%', 
      color: 'text-red-600',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#007185" strokeWidth="1.2" className="w-8 h-8">
          <rect x="4" y="8" width="16" height="12" rx="2" fill="#eaeded" />
          <path d="M4 12h16" />
          <path d="M16 16H8a2 2 0 0 1-2-2V4" stroke="#ff9900" strokeWidth="2" />
          <path d="M3 7l3-3 3 3" stroke="#ff9900" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    },
  ];

  const topProducts = [
    { id: '1', name: 'Sony WH-1000XM4 Wireless Headphones (Refurbished)', sales: 342, revenue: '₹47,880', views: 12400 },
    { id: '2', name: 'Dell XPS 13 Laptop - 16GB RAM, 512GB SSD', sales: 124, revenue: '₹1,11,600', views: 8900 },
    { id: '3', name: 'Apple iPhone 13 - 128GB (Pre-owned)', sales: 210, revenue: '₹94,500', views: 15600 },
    { id: '4', name: 'Samsung 32-inch 4K Monitor', sales: 89, revenue: '₹26,700', views: 4200 },
    { id: '5', name: 'Logitech MX Master 3S Wireless Mouse', sales: 450, revenue: '₹40,500', views: 18000 },
  ];

  const chartData = [
    { date: "Jun 24", visitors: 4000, organic: 2400 },
    { date: "Jun 25", visitors: 4500, organic: 2100 },
    { date: "Jun 26", visitors: 3800, organic: 1900 },
    { date: "Jun 27", visitors: 5200, organic: 2800 },
    { date: "Jun 28", visitors: 6100, organic: 3400 },
    { date: "Jun 29", visitors: 5800, organic: 3000 },
    { date: "Jun 30", visitors: 7100, organic: 4100 },
  ];

  const chartConfig = {
    visitors: {
      label: "Total Visitors",
      color: "#ff9900",
    },
    organic: {
      label: "Organic",
      color: "#c45500",
    },
  } satisfies ChartConfig;

  return (
    <div className="max-w-[1200px] w-full mx-auto p-4 flex flex-col gap-6">
      {/* Breadcrumb / Header */}
      <div className="flex items-center justify-between mt-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0f1111]">Analytical Dashboard</h1>
          <p className="text-[14px] text-[#565959] mt-1">Overview of your seller performance and metrics.</p>
        </div>
        <Link href="/seller" className="text-[#007185] hover:text-[#c45500] hover:underline text-[14px] font-medium">
          ← Back to Seller Central
        </Link>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {dummyMetrics.map((metric) => (
          <Card key={metric.title} className="rounded-md border-[#d5d9d9] shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-bold text-[#0f1111]">
                {metric.title}
              </CardTitle>
              {metric.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#0f1111]">{metric.value}</div>
              <p className={`text-xs mt-1 ${metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                {metric.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts / Performance section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-2 rounded-md border-[#d5d9d9] shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-[16px] font-bold text-[#0f1111]">Total Visitors</CardTitle>
              <CardDescription className="text-[#565959]">Total for the last 7 days</CardDescription>
            </div>
            <div className="flex bg-[#f3f3f3] rounded-md overflow-hidden text-[#0f1111] text-xs border border-[#d5d9d9]">
              <button className="px-3 py-1.5 border-r border-[#d5d9d9] hover:bg-[#e7e9ec]">Last 3 months</button>
              <button className="px-3 py-1.5 border-r border-[#d5d9d9] hover:bg-[#e7e9ec]">Last 30 days</button>
              <button className="px-3 py-1.5 bg-[#d5d9d9] font-medium">Last 7 days</button>
            </div>
          </CardHeader>
          <CardContent className="px-0 pb-0 pt-4">
            <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
              <AreaChart data={chartData} margin={{ left: 12, right: 12, bottom: 0 }}>
                <defs>
                  <linearGradient id="fillVisitors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-visitors)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="var(--color-visitors)" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="fillOrganic" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-organic)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="var(--color-organic)" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#eaeded" strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={12}
                  stroke="#565959"
                  fontSize={12}
                />
                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                <Area
                  dataKey="organic"
                  type="monotone"
                  fill="url(#fillOrganic)"
                  fillOpacity={1}
                  stroke="var(--color-organic)"
                  strokeWidth={2}
                />
                <Area
                  dataKey="visitors"
                  type="monotone"
                  fill="url(#fillVisitors)"
                  fillOpacity={1}
                  stroke="var(--color-visitors)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="rounded-md border-[#d5d9d9] shadow-sm">
          <CardHeader>
            <CardTitle className="text-[16px] font-bold text-[#0f1111]">Conversion Funnel</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-6 pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#007185" strokeWidth="1.2" className="w-6 h-6">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" fill="#eaeded" />
                  <circle cx="12" cy="12" r="4" fill="#007185" stroke="none" />
                  <circle cx="12" cy="12" r="1.5" fill="#ff9900" stroke="none" />
                </svg>
                <span className="text-[14px] text-[#0f1111]">Views</span>
              </div>
              <span className="font-bold text-[#0f1111]">124.5k</span>
            </div>
            <div className="w-full h-px bg-[#eaeded]" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#007185" strokeWidth="1.2" className="w-6 h-6">
                  <path d="M6 8h12l1 12H5L6 8z" fill="#eaeded" />
                  <path d="M9 8V5a3 3 0 0 1 6 0v3" />
                  <circle cx="12" cy="13" r="4" fill="#ff9900" stroke="none" />
                </svg>
                <span className="text-[14px] text-[#0f1111]">Add to Cart</span>
              </div>
              <span className="font-bold text-[#0f1111]">15.2k</span>
            </div>
            <div className="w-full h-px bg-[#eaeded]" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#007185" strokeWidth="1.2" className="w-6 h-6">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" fill="#eaeded" />
                  <path d="M3.27 6.96L12 12.01l8.73-5.05" />
                  <path d="M12 22V12" />
                  <polygon points="12,2 3,7 12,12 21,7" fill="#ff9900" stroke="none" />
                </svg>
                <span className="text-[14px] text-[#0f1111]">Purchased</span>
              </div>
              <span className="font-bold text-[#0f1111]">1.2k</span>
            </div>
            <div className="mt-4 p-3 bg-[#f3f3f3] rounded-md border border-[#d5d9d9]">
              <div className="text-[12px] text-[#565959]">Overall Conversion Rate</div>
              <div className="text-lg font-bold text-[#007185]">~ 1.0%</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Products Table */}
      <Card className="rounded-md border-[#d5d9d9] shadow-sm mb-12">
        <CardHeader>
          <CardTitle className="text-[16px] font-bold text-[#0f1111]">Top Performing Products</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-b border-[#eaeded] hover:bg-transparent">
                <TableHead className="text-[13px] font-bold text-[#565959]">Product Name</TableHead>
                <TableHead className="text-[13px] font-bold text-[#565959] text-right">Views</TableHead>
                <TableHead className="text-[13px] font-bold text-[#565959] text-right">Sales</TableHead>
                <TableHead className="text-[13px] font-bold text-[#565959] text-right">Revenue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topProducts.map((product) => (
                <TableRow key={product.id} className="border-b border-[#eaeded]">
                  <TableCell className="text-[14px] text-[#007185] font-medium hover:underline cursor-pointer">
                    {product.name}
                  </TableCell>
                  <TableCell className="text-[14px] text-[#0f1111] text-right">{product.views.toLocaleString()}</TableCell>
                  <TableCell className="text-[14px] text-[#0f1111] text-right">{product.sales}</TableCell>
                  <TableCell className="text-[14px] text-[#0f1111] font-bold text-right">{product.revenue}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
