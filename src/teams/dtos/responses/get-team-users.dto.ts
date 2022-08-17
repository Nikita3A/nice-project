import { ApiProperty } from "@nestjs/swagger";
import { UserRoleInTeam } from "src/teams/interfaces/team.interface";

export class ResGetTeamUsersDTO {
    @ApiProperty()
    id: number;

    @ApiProperty()
    name: string;

    @ApiProperty()
    email: string;
    
    @ApiProperty()
    role: UserRoleInTeam;
}