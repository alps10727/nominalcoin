
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Twitter, Linkedin, Github } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SocialLinks {
  twitter: string | null;
  linkedin: string | null;
  github: string | null;
}

interface TeamMember {
  id: number;
  name: string;
  role: string;
  imageUrl: string;
  description: string;
  skills: string[];
  socialLinks: SocialLinks;
}

interface TeamMemberCardProps {
  member: TeamMember;
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ member }) => {
  return (
    <Card className="border border-indigo-800/30 bg-gradient-to-br from-indigo-950/40 to-purple-950/40 backdrop-blur-sm overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row">
          <div className="w-full sm:w-1/3 h-[150px] sm:h-auto relative bg-gradient-to-br from-purple-800/30 to-indigo-800/30">
            <img 
              src={member.imageUrl} 
              alt={member.name}
              className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
            />
          </div>
          
          <div className="p-4 sm:p-5 w-full sm:w-2/3">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-lg font-semibold text-purple-100">{member.name}</h3>
                <p className="text-indigo-300 text-sm">{member.role}</p>
              </div>
              
              <div className="flex gap-2">
                {member.socialLinks.twitter && (
                  <a href={member.socialLinks.twitter} target="_blank" rel="noopener noreferrer" 
                     className="p-1.5 rounded-full bg-indigo-900/40 hover:bg-indigo-700/40 transition-colors">
                    <Twitter className="w-4 h-4 text-indigo-300" />
                  </a>
                )}
                
                {member.socialLinks.linkedin && (
                  <a href={member.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" 
                     className="p-1.5 rounded-full bg-indigo-900/40 hover:bg-indigo-700/40 transition-colors">
                    <Linkedin className="w-4 h-4 text-indigo-300" />
                  </a>
                )}
                
                {member.socialLinks.github && (
                  <a href={member.socialLinks.github} target="_blank" rel="noopener noreferrer" 
                     className="p-1.5 rounded-full bg-indigo-900/40 hover:bg-indigo-700/40 transition-colors">
                    <Github className="w-4 h-4 text-indigo-300" />
                  </a>
                )}
              </div>
            </div>
            
            <p className="text-gray-300 text-sm mb-3">{member.description}</p>
            
            <div className="flex flex-wrap gap-2">
              {member.skills.map(skill => (
                <Badge key={skill} variant="outline" className="bg-purple-900/30 text-purple-200 border-purple-500/30">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamMemberCard;
