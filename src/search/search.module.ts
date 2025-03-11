import { Module } from "@nestjs/common";
import { SearchService } from "./search.service";
import { PrismaService } from "src/prisma.service";
import { SearchController } from "./search.controller";
import { CoreService } from "src/core/core.service";


@Module({
  // imports:[PrismaService],
  providers: [SearchService, PrismaService, CoreService],
  controllers: [SearchController],
})
export class SearchModule {}