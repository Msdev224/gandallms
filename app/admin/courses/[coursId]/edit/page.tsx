import { adminGetCourse } from "@/app/data/admin/admin-get-course";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EditCourse } from "./_components/EditCourseForm";
import { CourseStructure } from "./_components/CourseStructure";
type Params = Promise<{coursId:string}>

const EditRoute = async ({params}: {params: Params}) => {
    const {coursId} = await params
    const data = await adminGetCourse(coursId);

  return (
    <div>
      <h1 className="txt- font-bold mb-8">
        Editer le Cours:{" "}
        <span className="text-primary underline">{data.title} </span>
      </h1>
      
      <Tabs defaultValue="basic-info" className="w-full" key="course-tabs">
        <TabsList className="gid grid-cols-2 w-full">
          <TabsTrigger value="basic-info">Informations Basiques</TabsTrigger>
          <TabsTrigger value="course-structure">Structure du cours</TabsTrigger>
        </TabsList>
        <TabsContent value="basic-info">
          <Card>
            <CardHeader>
              <CardTitle>Informations Basiques</CardTitle>
              <CardDescription>
                Editer les informations Basiques à propos du cours
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EditCourse data={data} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="course-structure">
          <Card>
            <CardHeader>
              <CardTitle>Structure Du cours</CardTitle>
              <CardDescription>
                Ici, vous pouvez mettre à jour la structure de votre cours
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CourseStructure data={data} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default EditRoute