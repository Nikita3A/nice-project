import { ApiProperty } from "@nestjs/swagger";
import { UserRoleInTeam } from "src/teams/interfaces/team.interface";

class Team {
    @ApiProperty()
    id: number;

    @ApiProperty()
    name: string;
}

class User {
    @ApiProperty()
    id: number;

    @ApiProperty()
    name: string;

    @ApiProperty()
    password: string;

    @ApiProperty()
    email: string;

    @ApiProperty({ enum: ['admin', 'user']})
    role: string;

    @ApiProperty()
    created_on: Date;

    @ApiProperty()
    last_login: Date;

    @ApiProperty()
    isEmailVerified: boolean;
}

export class ResAddUserToTeamDTO {
    @ApiProperty()
    team: Team;

    @ApiProperty()
    user: User;

    @ApiProperty({ enum: Object.values(UserRoleInTeam) })
    role: UserRoleInTeam;
    
    @ApiProperty()
    id: number;
}