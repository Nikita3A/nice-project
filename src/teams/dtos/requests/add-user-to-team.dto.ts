import { ApiProperty } from "@nestjs/swagger";
import { UserRoleInTeam } from "src/teams/interfaces/team.interface";

export class ReqAddUserToTeamDTO {
    @ApiProperty()
    email: string;

    @ApiProperty({ enum: Object.values(UserRoleInTeam) })
    role: UserRoleInTeam;
}