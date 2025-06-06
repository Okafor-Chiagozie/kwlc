"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, MapPin, Users, Phone, Mail, Award, Heart, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import MainLayout from "@/components/main-layout"

const pastorsData = {
  "senior-pastor-john": {
    name: "Pastor John Adebayo",
    title: "Senior Pastor",
    branch: "Main Campus - Victoria Island",
    role: "Lead Pastor",
    image: "/placeholder.svg?height=600&width=600",
    phone: "+234 70 433 2832",
    email: "pastor.john@kwlc.org",
    experience: "15+ Years",
    specialization: ["Leadership", "Church Planting", "Biblical Teaching"],
    members: "2,500+",
    bio: "Pastor John Adebayo has been the Senior Pastor of Kingdom Ways Living Church since 2009. With over 15 years of ministry experience, he has led the church through tremendous growth and expansion. His passion for biblical teaching and church planting has resulted in the establishment of multiple branches across Nigeria. Pastor John holds a Master's degree in Theology and is known for his practical, life-changing messages that bridge the gap between scripture and daily living.",
    education: [
      "Master of Theology - Lagos Baptist Seminary",
      "Bachelor of Arts in Religious Studies - University of Lagos",
      "Certificate in Church Leadership - Redeemed Christian Bible College",
    ],
    achievements: [
      "Planted 5 church branches across Nigeria",
      "Authored 3 books on Christian leadership",
      "Mentored over 50 pastors and church leaders",
      "Led church growth from 200 to 2,500+ members",
    ],
    ministries: [
      "Senior Leadership Team",
      "Church Planting Initiative",
      "Pastoral Training Program",
      "Community Outreach",
    ],
    schedule: [
      { day: "Sunday", time: "8:00 AM - 12:00 PM", activity: "Sunday Service" },
      { day: "Wednesday", time: "6:00 PM - 8:00 PM", activity: "Bible Study" },
      { day: "Friday", time: "2:00 PM - 4:00 PM", activity: "Pastoral Counseling" },
      { day: "Saturday", time: "10:00 AM - 12:00 PM", activity: "Leadership Meeting" },
    ],
  },
  "pastor-grace": {
    name: "Pastor Grace Okafor",
    title: "Associate Pastor",
    branch: "Lekki Branch",
    role: "Branch Pastor",
    image: "/placeholder.svg?height=600&width=600",
    phone: "+234 80 123 4567",
    email: "pastor.grace@kwlc.org",
    experience: "8+ Years",
    specialization: ["Women's Ministry", "Youth Development", "Counseling"],
    members: "800+",
    bio: "Pastor Grace Okafor leads the vibrant Lekki Branch of Kingdom Ways Living Church. With a heart for women's empowerment and youth development, she has transformed countless lives through her compassionate ministry approach. Her background in psychology and counseling brings a unique perspective to pastoral care, making her a sought-after counselor and mentor.",
    education: [
      "Master of Arts in Counseling Psychology - Covenant University",
      "Bachelor of Theology - Nigerian Baptist Seminary",
      "Certificate in Women's Ministry Leadership",
    ],
    achievements: [
      "Established Women's Empowerment Program",
      "Counseled over 500 individuals and families",
      "Led youth ministry growth by 300%",
      "Organized annual women's conference with 1000+ attendees",
    ],
    ministries: ["Women's Ministry", "Youth Development", "Marriage Counseling", "Community Support"],
    schedule: [
      { day: "Sunday", time: "9:00 AM - 1:00 PM", activity: "Sunday Service" },
      { day: "Tuesday", time: "6:00 PM - 8:00 PM", activity: "Women's Meeting" },
      { day: "Thursday", time: "3:00 PM - 5:00 PM", activity: "Counseling Sessions" },
      { day: "Saturday", time: "4:00 PM - 6:00 PM", activity: "Youth Fellowship" },
    ],
  },
  "pastor-david": {
    name: "Pastor David Ogundimu",
    title: "Youth Pastor",
    branch: "Ikeja Branch",
    role: "Youth & Young Adults",
    image: "/placeholder.svg?height=600&width=600",
    phone: "+234 90 876 5432",
    email: "pastor.david@kwlc.org",
    experience: "5+ Years",
    specialization: ["Youth Ministry", "Music", "Digital Evangelism"],
    members: "600+",
    bio: "Pastor David Ogundimu is a dynamic young leader who connects powerfully with the next generation. His innovative approach to ministry combines traditional biblical teaching with modern technology and creative arts. Under his leadership, the youth ministry has become one of the most vibrant and fastest-growing departments in the church.",
    education: [
      "Bachelor of Music - University of Lagos",
      "Diploma in Youth Ministry - Daystar Christian Centre",
      "Certificate in Digital Media Ministry",
    ],
    achievements: [
      "Launched online youth platform with 2000+ followers",
      "Organized youth concerts reaching 5000+ young people",
      "Developed digital discipleship curriculum",
      "Led mission trips to 3 African countries",
    ],
    ministries: ["Youth Ministry", "Music Ministry", "Digital Evangelism", "Young Adults Fellowship"],
    schedule: [
      { day: "Sunday", time: "10:00 AM - 2:00 PM", activity: "Youth Service" },
      { day: "Wednesday", time: "7:00 PM - 9:00 PM", activity: "Youth Bible Study" },
      { day: "Friday", time: "6:00 PM - 8:00 PM", activity: "Music Practice" },
      { day: "Saturday", time: "2:00 PM - 4:00 PM", activity: "Youth Outreach" },
    ],
  },
}

export default function PastorDetailPage({ params }: { params: { id: string } }) {
  const [pastor, setPastor] = useState<any>(null)

  useEffect(() => {
    if (params.id) {
      setPastor(pastorsData[params.id as keyof typeof pastorsData])
    }
  }, [params.id])

  if (!pastor) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Loading...</h1>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href="/pastors">
            <Button variant="ghost" className="text-primary hover:text-primary/80">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Pastors
            </Button>
          </Link>
        </div>
      </div>

      {/* Pastor Profile Header */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Pastor Image */}
            <div className="lg:col-span-1">
              <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <Image src={pastor.image || "/placeholder.svg"} alt={pastor.name} fill className="object-cover" />
              </div>
            </div>

            {/* Pastor Info */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                <div>
                  <Badge className="bg-primary/10 text-primary mb-4">{pastor.title}</Badge>
                  <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{pastor.name}</h1>
                  <p className="text-xl text-gray-600 mb-6">{pastor.bio}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium text-gray-900">Branch</p>
                        <p className="text-gray-600">{pastor.branch}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium text-gray-900">Ministry Role</p>
                        <p className="text-gray-600">{pastor.role}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium text-gray-900">Phone</p>
                        <p className="text-gray-600">{pastor.phone}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium text-gray-900">Email</p>
                        <p className="text-gray-600">{pastor.email}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 pt-4">
                  {pastor.specialization.map((spec: string) => (
                    <Badge key={spec} variant="outline" className="text-primary border-primary">
                      {spec}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Information */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Education & Achievements */}
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Education
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {pastor.education.map((edu: string, index: number) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span className="text-gray-700">{edu}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    Key Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {pastor.achievements.map((achievement: string, index: number) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span className="text-gray-700">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Ministries */}
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-primary" />
                    Ministry Areas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-3">
                    {pastor.ministries.map((ministry: string, index: number) => (
                      <div key={index} className="p-3 bg-primary/5 rounded-lg border border-primary/10">
                        <span className="text-gray-700 font-medium">{ministry}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  )
}
