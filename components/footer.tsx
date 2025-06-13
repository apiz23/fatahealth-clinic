import { Phone, MapPin } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-black text-white py-8">
            <div className="px-4 max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Clinic Info */}
                    <div>
                        <h3 className="text-lg font-bold mb-2">
                            Al Fatah Clinic
                        </h3>
                        <p className="text-gray-400 text-sm mb-4">
                            Quality healthcare with compassion and expertise.
                        </p>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-lg font-semibold mb-2">Contact</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li className="flex items-center">
                                <MapPin className="h-4 w-4 mr-2" />
                                <span>
                                    8, Ground Floor, Jalan Kelisa Utama 1, Taman
                                    Kelisa Utama, 86400 Parit Raja, Johor Darul
                                    Ta{"'"}zim
                                </span>
                            </li>
                            <li className="flex items-center">
                                <Phone className="h-4 w-4 mr-2" />
                                <span>+60 103154617</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-8 pt-4 border-t border-gray-800 text-center text-sm text-gray-500">
                    <p>
                        © {new Date().getFullYear()} Al Fatah Clinic. All rights
                        reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
