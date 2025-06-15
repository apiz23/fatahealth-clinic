import { Phone, MapPin, Contact } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-background text-foreground py-8 border-t dark:border-gray-800">
            <div className="px-4 max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Clinic Info */}
                    <div>
                        <h3 className="text-lg font-bold mb-2">
                            Al Fatah Clinic
                        </h3>
                        <p className="text-muted-foreground text-sm mb-4">
                            Quality healthcare with compassion and expertise.
                        </p>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-xl font-bold mb-4 flex items-center text-foreground">
                            <Contact className="h-5 w-5 mr-2" />
                            Contact Information
                        </h4>
                        <ul className="space-y-4">
                            <li className="flex items-start">
                                <div className="bg-primary/10 dark:bg-cyan-200/10 p-2 rounded-full mr-3">
                                    <MapPin className="h-5 w-5 text-primary dark:text-cyan-200" />
                                </div>
                                <div>
                                    <p className="font-medium text-foreground">
                                        Our Location
                                    </p>
                                    <p className="text-muted-foreground">
                                        8, Ground Floor, Jalan Kelisa Utama 1,
                                        <br />
                                        Taman Kelisa Utama,
                                        <br />
                                        86400 Parit Raja, Johor Darul Ta{"'"}zim
                                    </p>
                                </div>
                            </li>
                            <li className="flex items-start pt-3">
                                <div className="bg-primary/10 dark:bg-cyan-200/10 p-2 rounded-full mr-3">
                                    <Phone className="h-5 w-5 text-primary dark:text-cyan-200" />
                                </div>
                                <div>
                                    <p className="font-medium text-foreground">
                                        Phone Number
                                    </p>
                                    <a
                                        href="tel:+60103154617"
                                        className="text-muted-foreground hover:text-primary dark:hover:text-cyan-200 transition-colors"
                                    >
                                        +60 10-315 4617
                                    </a>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-8 pt-4 border-t border-border text-center text-sm text-muted-foreground">
                    <p>
                        © {new Date().getFullYear()} Al Fatah Clinic. All rights
                        reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
