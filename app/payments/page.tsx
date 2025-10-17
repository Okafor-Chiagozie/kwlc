"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { 
  DollarSign,
  Copy,
  Building2,
  Banknote,
  Globe,
  CheckCircle,
  Info,
  CreditCard,
  ArrowRight,
  Heart,
  Loader2,
  Wallet,
  ShieldCheck
} from "lucide-react"
import MainLayout from "@/components/main-layout"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { initiatePayment } from "@/services/payment"
import { Currency, PurposeCode, PaymentMethod } from "@/types/payment"

interface BankAccount {
  id: string
  currency: string
  currencySymbol: string
  accountName: string
  accountNumber: string
  bankName: string
  icon: any
  color: string
  bgColor: string
  borderColor: string
}

export default function PaymentsPage() {
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  
  // Online payment form state
  const [paymentForm, setPaymentForm] = useState({
    firstName: "",
    email: "",
    amount: ""
  })

  // Check for payment success/failure in URL on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const paymentStatus = urlParams.get('payment')
      
      if (paymentStatus === 'success') {
        toast.success('Payment completed! Thank you for your contribution.')
        // Clean up URL
        window.history.replaceState({}, '', '/payments')
      } else if (paymentStatus === 'failed') {
        toast.error('Payment was not completed. Please try again.')
        // Clean up URL
        window.history.replaceState({}, '', '/payments')
      }
    }
  }, [])

  // Bank Accounts Data
  const bankAccounts: BankAccount[] = [
    {
      id: "naira",
      currency: "Naira",
      currencySymbol: "₦ NGN",
      accountName: "Kingdom Worship Life Church",
      accountNumber: "0123456789",
      bankName: "First Bank of Nigeria",
      icon: Banknote,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    },
    {
      id: "dollar",
      currency: "Dollar",
      currencySymbol: "$ USD",
      accountName: "Kingdom Worship Life Church",
      accountNumber: "9876543210",
      bankName: "Standard Chartered Bank",
      icon: DollarSign,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      id: "euro",
      currency: "Euro",
      currencySymbol: "€ EUR",
      accountName: "Kingdom Worship Life Church",
      accountNumber: "5555666677",
      bankName: "HSBC Bank",
      icon: Globe,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200"
    }
  ]

  const copyToClipboard = (text: string, label: string, fieldId: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(fieldId)
    toast.success(`${label} copied!`)
    
    setTimeout(() => {
      setCopiedField(null)
    }, 2000)
  }

  const handleInputChange = (field: keyof typeof paymentForm, value: string) => {
    setPaymentForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const validateForm = () => {
    if (!paymentForm.firstName.trim()) {
      toast.error("Please enter your first name")
      return false
    }
    if (!paymentForm.email.trim()) {
      toast.error("Please enter your email address")
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(paymentForm.email)) {
      toast.error("Please enter a valid email address")
      return false
    }
    if (!paymentForm.amount.trim()) {
      toast.error("Please enter an amount")
      return false
    }
    const amount = parseFloat(paymentForm.amount)
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount")
      return false
    }
    if (amount < 100) {
      toast.error("Minimum payment amount is ₦100")
      return false
    }
    return true
  }

  const handlePaymentSubmit = async () => {
    if (!validateForm()) return

    setIsProcessing(true)

    try {
      const amount = parseFloat(paymentForm.amount)
      const reference = `TITHE-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
      
      const payload = {
        entryId: 0, // Default entry ID for general payments
        amount: amount,
        currencyId: Currency.NGN,
        name: paymentForm.firstName,
        email: paymentForm.email,
        phoneNumber: "", // Optional
        reference: reference,
        purpose: PurposeCode.DON, // Donation purpose code
        paymentMethod: PaymentMethod.Card,
        callbackUrl: `${window.location.origin}/payments?payment=success`
      }

      const response = await initiatePayment(payload)

      if (response.status && response.data?.checkoutUrl) {
        // Redirect to Fincra checkout
        toast.success("Redirecting to payment gateway...")
        setTimeout(() => {
          window.location.href = response.data.checkoutUrl
        }, 1000)
      } else {
        toast.error(response.message || "Failed to initiate payment")
        setIsProcessing(false)
      }
    } catch (error: any) {
      console.error("Payment initiation error:", error)
      toast.error("An error occurred. Please try again.")
      setIsProcessing(false)
    }
  }

  const resetForm = () => {
    setPaymentForm({
      firstName: "",
      email: "",
      amount: ""
    })
  }

  const handleDialogClose = () => {
    if (!isProcessing) {
      setIsDialogOpen(false)
      resetForm()
    }
  }

  return (
    <MainLayout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative h-[400px] overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/donation.png-9JtcRLA0zWlxl6ac4XovOm11jhfnK9.jpeg"
              alt="Payment Information"
              fill
              className="object-cover brightness-[0.35]"
              priority
            />
          </div>
          
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"></div>
          
          <div className="relative h-full flex items-center justify-center text-center text-white px-4">
            <div className="max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 font-medium text-sm mb-6">
                <CreditCard className="h-4 w-4" />
                <span>Payment Information</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Bank Account Details
              </h1>
              <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
                Support the work of God through your generous giving. Choose your preferred currency below.
              </p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4">
            {/* Online Payment Section */}
            <div className="max-w-5xl mx-auto mb-12">
              <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-white shadow-xl overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10"></div>
                <CardHeader className="text-center pb-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mx-auto mb-4">
                    <Wallet className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-3xl md:text-4xl font-bold mb-3">
                    Pay Online Now
                  </CardTitle>
                  <CardDescription className="text-base md:text-lg">
                    Make your tithe, offering, or donation securely through our online payment system
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid sm:grid-cols-3 gap-4 py-6">
                    <div className="flex items-center gap-3 justify-center sm:justify-start">
                      <div className="p-2 rounded-lg bg-green-50">
                        <ShieldCheck className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="text-sm">
                        <div className="font-semibold text-gray-900">Secure</div>
                        <div className="text-gray-600">SSL Encrypted</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 justify-center sm:justify-start">
                      <div className="p-2 rounded-lg bg-blue-50">
                        <CreditCard className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="text-sm">
                        <div className="font-semibold text-gray-900">Fast</div>
                        <div className="text-gray-600">Instant Process</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 justify-center sm:justify-start">
                      <div className="p-2 rounded-lg bg-purple-50">
                        <CheckCircle className="h-5 w-5 text-purple-600" />
                      </div>
                      <div className="text-sm">
                        <div className="font-semibold text-gray-900">Reliable</div>
                        <div className="text-gray-600">Powered by Fincra</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-center pt-2">
                    <Button 
                      size="lg" 
                      className="gap-2 text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all"
                      onClick={() => setIsDialogOpen(true)}
                    >
                      <Wallet className="h-5 w-5" />
                      Make Payment
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </div>

                  <div className="text-center pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                      💳 We accept all major cards and bank transfers
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Divider */}
            <div className="max-w-5xl mx-auto mb-12">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-gradient-to-b from-gray-50 to-white px-4 text-sm text-gray-600 font-medium">
                    or use bank transfer
                  </span>
                </div>
              </div>
            </div>

            {/* Info Banner */}
            <div className="max-w-5xl mx-auto mb-12">
              <Card className="border-blue-200 bg-blue-50/80 shadow-sm">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <div className={cn("p-2 rounded-lg bg-blue-100 flex-shrink-0")}>
                      <Info className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="space-y-2 flex-1">
                      <h3 className="font-semibold text-blue-900 text-lg">
                        How to Make a Payment
                      </h3>
                      <p className="text-sm text-blue-800 leading-relaxed">
                        Select your preferred currency and use the account details below to make your donation or payment. 
                        Click the copy icon to easily copy account information. All donations go directly towards supporting 
                        our church programs and community initiatives.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Bank Accounts Grid */}
            <div className="max-w-6xl mx-auto grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
              {bankAccounts.map((account) => {
                const Icon = account.icon
                
                return (
                  <Card 
                    key={account.id} 
                    className={cn(
                      "group hover:shadow-2xl transition-all duration-300 border-2",
                      account.borderColor,
                      "hover:scale-[1.02]"
                    )}
                  >
                    <CardHeader className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className={cn(
                          "p-3 rounded-xl transition-transform group-hover:scale-110",
                          account.bgColor
                        )}>
                          <Icon className={cn("h-7 w-7", account.color)} />
                        </div>
                        <Badge 
                          variant="secondary" 
                          className={cn(
                            "font-bold text-sm px-3 py-1",
                            account.bgColor,
                            account.color
                          )}
                        >
                          {account.currencySymbol}
                        </Badge>
                      </div>
                      <div>
                        <CardTitle className="text-2xl mb-2">
                          {account.currency} Account
                        </CardTitle>
                        <CardDescription className="text-sm">
                          Make payments in {account.currency}
                        </CardDescription>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-5">
                      {/* Account Name */}
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          Account Name
                        </label>
                        <div className="relative group/item">
                          <div className={cn(
                            "p-4 rounded-lg border-2 transition-all",
                            account.bgColor,
                            "border-transparent"
                          )}>
                            <p className="text-sm font-semibold text-gray-900 break-words pr-8">
                              {account.accountName}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={cn(
                              "absolute top-2 right-2 h-8 w-8 p-0 opacity-0 group-hover/item:opacity-100 transition-opacity",
                              account.color
                            )}
                            onClick={() => copyToClipboard(
                              account.accountName, 
                              'Account name', 
                              `${account.id}-name`
                            )}
                          >
                            {copiedField === `${account.id}-name` ? (
                              <CheckCircle className="h-4 w-4" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>

                      {/* Account Number */}
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          Account Number
                        </label>
                        <div className="relative group/item">
                          <div className={cn(
                            "p-4 rounded-lg border-2 transition-all",
                            account.bgColor,
                            "border-transparent"
                          )}>
                            <p className="text-xl font-mono font-bold text-gray-900 tracking-wider">
                              {account.accountNumber}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={cn(
                              "absolute top-2 right-2 h-8 w-8 p-0 opacity-0 group-hover/item:opacity-100 transition-opacity",
                              account.color
                            )}
                            onClick={() => copyToClipboard(
                              account.accountNumber, 
                              'Account number', 
                              `${account.id}-number`
                            )}
                          >
                            {copiedField === `${account.id}-number` ? (
                              <CheckCircle className="h-4 w-4" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>

                      {/* Bank Name */}
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          Bank Name
                        </label>
                        <div className={cn(
                          "p-4 rounded-lg border-2 flex items-center gap-3",
                          account.bgColor,
                          "border-transparent"
                        )}>
                          <Building2 className={cn("h-5 w-5 flex-shrink-0", account.color)} />
                          <p className="text-sm font-semibold text-gray-900">
                            {account.bankName}
                          </p>
                        </div>
                      </div>

                      {/* Copy All Button */}
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full mt-4 font-semibold gap-2 border-2",
                          account.borderColor,
                          account.color,
                          "hover:bg-opacity-10"
                        )}
                        onClick={() => {
                          const allDetails = `Account Name: ${account.accountName}\nAccount Number: ${account.accountNumber}\nBank: ${account.bankName}`
                          copyToClipboard(allDetails, 'All account details', `${account.id}-all`)
                        }}
                      >
                        {copiedField === `${account.id}-all` ? (
                          <>
                            <CheckCircle className="h-4 w-4" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4" />
                            Copy All Details
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Call to Action Section */}
            <div className="max-w-4xl mx-auto">
              <Card className="bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 border-primary/20 shadow-lg">
                <CardContent className="p-8 md:p-12">
                  <div className="text-center space-y-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-2">
                      <Heart className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold mb-3 text-gray-900">
                        Thank You for Your Generosity
                      </h2>
                      <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
                        Your contributions enable us to continue spreading the gospel, supporting our community, 
                        and making a positive impact in the lives of many. May God bless you abundantly!
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                      <Button 
                        size="lg" 
                        className="gap-2 shadow-lg"
                        onClick={() => window.location.href = '/donations'}
                      >
                        View Our Projects
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="lg" 
                        variant="outline"
                        className="gap-2"
                        onClick={() => window.location.href = '/'}
                      >
                        Back to Home
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Additional Information */}
            <div className="max-w-5xl mx-auto mt-12 grid md:grid-cols-3 gap-6">
              <Card className="border-gray-200 hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="text-center space-y-3">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-50">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Secure Payments</h3>
                    <p className="text-sm text-gray-600">
                      All transactions are secure and verified by the bank
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200 hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="text-center space-y-3">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-50">
                      <Globe className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Multiple Currencies</h3>
                    <p className="text-sm text-gray-600">
                      Support available in Naira, Dollar, and Euro
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200 hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="text-center space-y-3">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-50">
                      <Heart className="h-6 w-6 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Direct Impact</h3>
                    <p className="text-sm text-gray-600">
                      100% of donations go to church programs and initiatives
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Payment Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Wallet className="h-6 w-6 text-primary" />
                </div>
                <DialogTitle className="text-2xl">Online Payment</DialogTitle>
              </div>
              <DialogDescription className="text-base">
                Enter your details below to make a secure online payment via Fincra payment gateway.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-5 py-4">
              {/* Info Alert */}
              <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                <div className="flex items-start gap-2">
                  <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-900">
                    <p className="font-semibold mb-1">Secure Online Payment</p>
                    <p className="text-blue-800">
                      You will be redirected to Fincra's secure payment page to complete your transaction.
                    </p>
                  </div>
                </div>
              </div>

              {/* First Name */}
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-base font-semibold">
                  First Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="firstName"
                  placeholder="Enter your first name"
                  value={paymentForm.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  disabled={isProcessing}
                  className="h-11"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-base font-semibold">
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={paymentForm.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  disabled={isProcessing}
                  className="h-11"
                />
                <p className="text-xs text-gray-500">
                  We'll send your payment receipt to this email
                </p>
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-base font-semibold">
                  Amount (₦) <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                    ₦
                  </span>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={paymentForm.amount}
                    onChange={(e) => handleInputChange("amount", e.target.value)}
                    disabled={isProcessing}
                    className="h-11 pl-8 text-lg font-semibold"
                    min="100"
                    step="100"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Minimum amount: ₦100
                </p>
              </div>

              {/* Quick Amount Buttons */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Quick Select:</p>
                <div className="grid grid-cols-4 gap-2">
                  {[1000, 5000, 10000, 20000].map((amount) => (
                    <Button
                      key={amount}
                      variant="outline"
                      size="sm"
                      onClick={() => handleInputChange("amount", amount.toString())}
                      disabled={isProcessing}
                      className="font-semibold"
                    >
                      ₦{amount.toLocaleString()}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                onClick={handleDialogClose}
                disabled={isProcessing}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                onClick={handlePaymentSubmit}
                disabled={isProcessing}
                className="w-full sm:w-auto gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4" />
                    Proceed to Payment
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  )
}
