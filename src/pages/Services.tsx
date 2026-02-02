import { Layout } from "@/components/layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowRight, Mic2, UsersRound, Home, Database } from "lucide-react";
import { Link } from "react-router-dom";

const Services = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container-wide text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 hero-text-gradient">
            Our Services
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Discover our comprehensive range of business solutions designed to drive growth, 
            foster innovation, and create lasting connections in your industry.
          </p>
        </div>
      </section>

      {/* Services Tabs */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container-wide">
          <Tabs defaultValue="conferences" className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-12">
              <TabsTrigger value="conferences" className="gap-2">
                <Mic2 className="h-4 w-4" />
                Conferences
              </TabsTrigger>
              <TabsTrigger value="roundtable" className="gap-2">
                <UsersRound className="h-4 w-4" />
                Roundtable
              </TabsTrigger>
              <TabsTrigger value="in-house" className="gap-2">
                <Home className="h-4 w-4" />
                In-House
              </TabsTrigger>
              <TabsTrigger value="data-generation" className="gap-2">
                <Database className="h-4 w-4" />
                Data Generation
              </TabsTrigger>
            </TabsList>

            {/* Conferences Tab */}
            <TabsContent value="conferences">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 bg-orange-500/10 text-orange-500 px-4 py-2 rounded-full mb-4">
                    <Mic2 className="h-5 w-5" />
                    <span className="font-semibold">Conferences</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-6">
                    Leading Industry Events & Discussions
                  </h2>
                  <p className="text-lg text-muted-foreground mb-6">
                    Our flagship conferences bring together industry leaders, innovators, and decision-makers 
                    from around the globe. Experience thought-provoking keynotes, interactive sessions, and 
                    unparalleled networking opportunities.
                  </p>
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="p-4 rounded-xl bg-secondary/50">
                      <h4 className="font-semibold mb-2">Expert Speakers</h4>
                      <p className="text-sm text-muted-foreground">Learn from industry pioneers</p>
                    </div>
                    <div className="p-4 rounded-xl bg-secondary/50">
                      <h4 className="font-semibold mb-2">Global Networking</h4>
                      <p className="text-sm text-muted-foreground">Connect worldwide</p>
                    </div>
                    <div className="p-4 rounded-xl bg-secondary/50">
                      <h4 className="font-semibold mb-2">Actionable Insights</h4>
                      <p className="text-sm text-muted-foreground">Practical takeaways</p>
                    </div>
                    <div className="p-4 rounded-xl bg-secondary/50">
                      <h4 className="font-semibold mb-2">Innovation Focus</h4>
                      <p className="text-sm text-muted-foreground">Latest trends & tech</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Button asChild>
                      <Link to="/conferences">
                        Learn More <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link to="/contact">Contact Us</Link>
                    </Button>
                  </div>
                </div>
                <div className="rounded-2xl overflow-hidden shadow-xl">
                  <img
                    src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800"
                    alt="Conference"
                    className="w-full h-auto aspect-[4/3] object-cover"
                  />
                </div>
              </div>
            </TabsContent>

            {/* Roundtable Tab */}
            <TabsContent value="roundtable">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="order-2 lg:order-1 rounded-2xl overflow-hidden shadow-xl">
                  <img
                    src="https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800"
                    alt="Roundtable Discussion"
                    className="w-full h-auto aspect-[4/3] object-cover"
                  />
                </div>
                <div className="order-1 lg:order-2">
                  <div className="inline-flex items-center gap-2 bg-cyan-500/10 text-cyan-500 px-4 py-2 rounded-full mb-4">
                    <UsersRound className="h-5 w-5" />
                    <span className="font-semibold">Roundtable</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-6">
                    Exclusive, High-Level Discussions
                  </h2>
                  <p className="text-lg text-muted-foreground mb-6">
                    Participate in exclusive roundtable discussions where senior executives and industry 
                    leaders share insights, challenges, and solutions in a collaborative, confidential environment.
                  </p>
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="p-4 rounded-xl bg-secondary/50">
                      <h4 className="font-semibold mb-2">Peer Learning</h4>
                      <p className="text-sm text-muted-foreground">Executive experiences</p>
                    </div>
                    <div className="p-4 rounded-xl bg-secondary/50">
                      <h4 className="font-semibold mb-2">Strategic Insights</h4>
                      <p className="text-sm text-muted-foreground">Critical business issues</p>
                    </div>
                    <div className="p-4 rounded-xl bg-secondary/50">
                      <h4 className="font-semibold mb-2">Confidential</h4>
                      <p className="text-sm text-muted-foreground">Trusted environment</p>
                    </div>
                    <div className="p-4 rounded-xl bg-secondary/50">
                      <h4 className="font-semibold mb-2">Action-Oriented</h4>
                      <p className="text-sm text-muted-foreground">Practical solutions</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Button asChild>
                      <Link to="/roundtable">
                        Learn More <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link to="/contact">Request Invitation</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* In-House Tab */}
            <TabsContent value="in-house">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 bg-gray-600/10 text-gray-600 px-4 py-2 rounded-full mb-4">
                    <Home className="h-5 w-5" />
                    <span className="font-semibold">In-House</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-6">
                    Tailored Solutions for Your Organization
                  </h2>
                  <p className="text-lg text-muted-foreground mb-6">
                    Bring world-class training and development directly to your organization with our 
                    customized in-house events, designed to meet your specific business needs and objectives.
                  </p>
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="p-4 rounded-xl bg-secondary/50">
                      <h4 className="font-semibold mb-2">Customized Content</h4>
                      <p className="text-sm text-muted-foreground">Tailored programs</p>
                    </div>
                    <div className="p-4 rounded-xl bg-secondary/50">
                      <h4 className="font-semibold mb-2">Expert Facilitators</h4>
                      <p className="text-sm text-muted-foreground">Industry leaders</p>
                    </div>
                    <div className="p-4 rounded-xl bg-secondary/50">
                      <h4 className="font-semibold mb-2">Flexible Scheduling</h4>
                      <p className="text-sm text-muted-foreground">Your timeline</p>
                    </div>
                    <div className="p-4 rounded-xl bg-secondary/50">
                      <h4 className="font-semibold mb-2">Measurable Results</h4>
                      <p className="text-sm text-muted-foreground">Track ROI</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Button asChild>
                      <Link to="/in-house">
                        Learn More <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link to="/contact">Get Started</Link>
                    </Button>
                  </div>
                </div>
                <div className="rounded-2xl overflow-hidden shadow-xl">
                  <img
                    src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800"
                    alt="In-House Training"
                    className="w-full h-auto aspect-[4/3] object-cover"
                  />
                </div>
              </div>
            </TabsContent>

            {/* Data Generation Tab */}
            <TabsContent value="data-generation">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="order-2 lg:order-1 rounded-2xl overflow-hidden shadow-xl">
                  <img
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800"
                    alt="Data Generation"
                    className="w-full h-auto aspect-[4/3] object-cover"
                  />
                </div>
                <div className="order-1 lg:order-2">
                  <div className="inline-flex items-center gap-2 bg-purple-500/10 text-purple-500 px-4 py-2 rounded-full mb-4">
                    <Database className="h-5 w-5" />
                    <span className="font-semibold">Data Generation</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-6">
                    Custom Data as Per Your Needs
                  </h2>
                  <p className="text-lg text-muted-foreground mb-6">
                    Join our data-focused events to explore cutting-edge analytics, data science methodologies, 
                    and business intelligence strategies that drive informed decision-making.
                  </p>
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="p-4 rounded-xl bg-secondary/50">
                      <h4 className="font-semibold mb-2">Data Analytics</h4>
                      <p className="text-sm text-muted-foreground">Modern tools & techniques</p>
                    </div>
                    <div className="p-4 rounded-xl bg-secondary/50">
                      <h4 className="font-semibold mb-2">Business Intelligence</h4>
                      <p className="text-sm text-muted-foreground">Actionable insights</p>
                    </div>
                    <div className="p-4 rounded-xl bg-secondary/50">
                      <h4 className="font-semibold mb-2">Data Science</h4>
                      <p className="text-sm text-muted-foreground">ML & AI applications</p>
                    </div>
                    <div className="p-4 rounded-xl bg-secondary/50">
                      <h4 className="font-semibold mb-2">Best Practices</h4>
                      <p className="text-sm text-muted-foreground">Industry strategies</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Button asChild>
                      <Link to="/data-generation">
                        Learn More <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link to="/contact">Contact Us</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container-wide text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto mb-8">
            Explore our services and discover how we can help drive your business forward.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/events">
                View All Events <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Services;